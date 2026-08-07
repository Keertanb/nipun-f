import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAuth } from './AuthContext'
import { fetchTeacherStudents, submitStudentReview } from '../api/teacher'
import { fetchActiveRound } from '../api/rounds'
import { fetchTeacherStageWorkspace } from '../api/stages'

const ReviewContext = createContext(null)

export function ReviewProvider({ children }) {
  const { user, updateTeacherMeta } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [round, setRound] = useState(null)
  const [canSubmit, setCanSubmit] = useState(false)
  const [stage, setStage] = useState(null)
  const [workspace, setWorkspace] = useState(null)
  const classesAssignedRef = useRef(null)
  const requestIdRef = useRef(0)

  const updateWorkspace = useCallback((next) => {
    setWorkspace(next)
    if (next?.activeStage) setStage(next.activeStage)
    else if (next === null) setStage(null)
    if (next?.round) setRound(next.round)
    if (typeof next?.canSubmit === 'boolean') setCanSubmit(next.canSubmit)
  }, [])

  const loadStudents = useCallback(
    async (opts) => {
      // Ignore synthetic click events from onClick={reloadStudents}
      const withWorkspace =
        opts && typeof opts === 'object' && 'withWorkspace' in opts ? Boolean(opts.withWorkspace) : true
      const silent = Boolean(opts && typeof opts === 'object' && opts.silent)

      if (user?.role !== 'teacher' || !user?.teacher?.id) {
        setStudents([])
        setRound(null)
        setCanSubmit(false)
        setStage(null)
        setWorkspace(null)
        return
      }

      const requestId = ++requestIdRef.current
      if (!silent) {
        setLoading(true)
        setError(null)
      }
      try {
        const tasks = [fetchTeacherStudents(), fetchActiveRound()]
        if (withWorkspace) {
          tasks.push(fetchTeacherStageWorkspace().catch(() => null))
        }

        const results = await Promise.all(tasks)
        if (requestId !== requestIdRef.current) return

        const [{ students: list, classesAssigned, meta, round: listRound, canSubmit: listCanSubmit, stage: listStage }, active] =
          results
        const stageWs = withWorkspace ? results[2] : undefined

        const withSchool = list.map((s) => ({
          ...s,
          schoolName: user.school?.school || user.teacher.schoolName || s.schoolName,
          district: user.school?.district || user.teacher.district || s.district,
          block: user.school?.block || user.teacher.block || s.block,
          cluster: user.school?.cluster || user.teacher.cluster || s.cluster,
          teacherId: meta.teacherId || user.teacher.id,
          teacherName: meta.teacherName || user.teacher.name,
        }))
        setStudents(withSchool)
        setRound(listRound || active.round || null)
        setCanSubmit(Boolean(listCanSubmit ?? active.canSubmit))

        if (withWorkspace) {
          setStage(listStage || stageWs?.activeStage || null)
          setWorkspace(stageWs ?? null)
        } else if (listStage) {
          setStage(listStage)
        }

        const nextClasses = classesAssigned || []
        const nextKey = nextClasses.join('|')
        if (classesAssignedRef.current !== nextKey) {
          classesAssignedRef.current = nextKey
          updateTeacherMeta?.({ classesAssigned: nextClasses })
        }
      } catch (err) {
        if (requestId !== requestIdRef.current) return
        if (!silent) {
          setError(err.message || 'Failed to load students')
          setStudents([])
          setRound(null)
          setCanSubmit(false)
          setStage(null)
          if (withWorkspace) setWorkspace(null)
        }
      } finally {
        if (!silent && requestId === requestIdRef.current) setLoading(false)
      }
    },
    [user?.role, user?.teacher?.id, user?.school?.schoolid, updateTeacherMeta],
  )

  const refreshWorkspace = useCallback(async () => {
    try {
      const stageWs = await fetchTeacherStageWorkspace()
      updateWorkspace(stageWs)
      return stageWs
    } catch {
      return null
    }
  }, [updateWorkspace])

  useEffect(() => {
    loadStudents({ withWorkspace: true })
  }, [loadStudents])

  const submitReview = useCallback(
    async (studentId, { reviews }) => {
      const result = await submitStudentReview(studentId, { reviews })
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? {
                ...s,
                status: result.status || 'Pending',
                subjects: {
                  Gujarati: result.subjects?.Gujarati || null,
                  Maths: result.subjects?.Maths || null,
                },
                review: result.subjects?.Gujarati?.review || null,
                remarks: result.subjects?.Gujarati?.remarks || '',
                reviewDate: result.reviewDate,
              }
            : s,
        ),
      )
      // One workspace refresh for stage completion counts — no full students reload
      refreshWorkspace()
      return result
    },
    [refreshWorkspace],
  )

  const value = useMemo(
    () => ({
      students,
      submitReview,
      loading,
      error,
      reloadStudents: loadStudents,
      refreshWorkspace,
      round,
      canSubmit,
      stage,
      workspace,
      updateWorkspace,
    }),
    [
      students,
      submitReview,
      loading,
      error,
      loadStudents,
      refreshWorkspace,
      round,
      canSubmit,
      stage,
      workspace,
      updateWorkspace,
    ],
  )

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
}

export function useReviews() {
  return useContext(ReviewContext)
}
