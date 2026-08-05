import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { fetchTeacherStudents, submitStudentReview } from '../api/teacher'
import { fetchActiveRound } from '../api/rounds'

const ReviewContext = createContext(null)

export function ReviewProvider({ children }) {
  const { user, updateTeacherMeta } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [round, setRound] = useState(null)
  const [canSubmit, setCanSubmit] = useState(false)

  const loadStudents = useCallback(async () => {
    if (user?.role !== 'teacher' || !user?.teacher?.id) {
      setStudents([])
      setRound(null)
      setCanSubmit(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [{ students: list, classesAssigned, meta, round: listRound, canSubmit: listCanSubmit }, active] =
        await Promise.all([fetchTeacherStudents(), fetchActiveRound()])

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
      updateTeacherMeta?.({ classesAssigned })
    } catch (err) {
      setError(err.message || 'Failed to load students')
      setStudents([])
      setRound(null)
      setCanSubmit(false)
    } finally {
      setLoading(false)
    }
  }, [user?.role, user?.teacher?.id, user?.school?.schoolid, updateTeacherMeta])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  async function submitReview(studentId, { reviews }) {
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
          : s
      )
    )
    return result
  }

  return (
    <ReviewContext.Provider
      value={{
        students,
        submitReview,
        loading,
        error,
        reloadStudents: loadStudents,
        round,
        canSubmit,
      }}
    >
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviews() {
  return useContext(ReviewContext)
}
