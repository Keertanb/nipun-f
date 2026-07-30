import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { fetchTeacherStudents, submitStudentReview } from '../api/teacher'

const ReviewContext = createContext(null)

export function ReviewProvider({ children }) {
  const { user, updateTeacherMeta } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadStudents = useCallback(async () => {
    if (user?.role !== 'teacher' || !user?.teacher?.id) {
      setStudents([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const { students: list, classesAssigned, meta } = await fetchTeacherStudents()
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
      updateTeacherMeta?.({ classesAssigned })
    } catch (err) {
      setError(err.message || 'Failed to load students')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }, [user?.role, user?.teacher?.id, user?.school?.schoolid, updateTeacherMeta])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  async function submitReview(studentId, { review, remarks }) {
    const result = await submitStudentReview(studentId, { review, remarks })
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: 'Completed',
              review: result.review,
              remarks: result.remarks,
              reviewDate: result.reviewDate,
            }
          : s
      )
    )
    return result
  }

  return (
    <ReviewContext.Provider value={{ students, submitReview, loading, error, reloadStudents: loadStudents }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviews() {
  return useContext(ReviewContext)
}
