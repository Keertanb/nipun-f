import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  School,
  GraduationCap,
  CheckCircle2,
  Sprout,
  TrendingUp,
  Award,
  MapPin,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { fetchSchoolStudents } from '../../api/master'
import { REVIEW_LEVELS } from '../../i18n/translations'
import { SquiggleUnderline } from '../../components/illustrations/Doodles'

const SUBJECTS = [
  { key: 'Gujarati', label: 'Gujarati' },
  { key: 'Maths', label: 'Maths' },
]

const levelIcons = {
  sprout: Sprout,
  trending: TrendingUp,
  award: Award,
}

const levelLabels = {
  Bad: 'Emerging (0 to 30%)',
  Average: 'Progressive (31 to 79%)',
  Good: 'Proficient (80% or more)',
}

export default function AdminStudentDetail() {
  const { schoolId, studentId } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!schoolId || !studentId) return
      setLoading(true)
      setError('')
      try {
        const data = await fetchSchoolStudents(schoolId)
        if (cancelled) return
        const found = (data.students || []).find((s) => String(s.id) === String(studentId))
        setStudent(found || null)
        if (!found) setError('Student not found in this school')
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load student')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [schoolId, studentId])

  if (loading) {
    return <p className="text-sky-800/60 text-sm py-20 text-center">Loading student…</p>
  }

  if (error || !student) {
    return (
      <div className="text-center py-20">
        <p className="font-heading font-bold text-sky-900">{error || 'Student not found'}</p>
        <Button className="mt-5" onClick={() => navigate('/admin/school-status')}>
          Go Back
        </Button>
      </div>
    )
  }

  const completed = student.status === 'Completed'

  return (
    <div className="relative space-y-6 max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => navigate('/admin/school-status')}
        className="flex items-center gap-2 text-sky-700 font-semibold text-sm hover:text-sky-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to School Status
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-sky-600 to-leaf-600 rounded-xl3 shadow-soft p-4 sm:p-8 text-white"
      >
        <div className="absolute -top-10 -right-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/10" />

        <div className="relative flex items-start sm:items-center gap-4 sm:gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl break-words">{student.name}</h1>
              <Badge type={completed ? 'Completed' : 'Pending'} className="!bg-white/95 shadow-soft">
                {student.status}
              </Badge>
            </div>
            <p className="text-white/80 text-xs sm:text-sm mt-1">
              Roll No. {student.rollNo} · {student.class} · {student.gender}
              {student.age != null ? ` · Age ${student.age}` : ''}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-sky-700/50">Teacher</p>
              <p className="font-semibold text-sky-900 text-sm truncate">{student.teacherName || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-leaf-100 flex items-center justify-center text-leaf-600 shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-sky-700/50">School</p>
              <p className="font-semibold text-sky-900 text-sm truncate">{student.schoolName || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <div className="w-10 h-10 rounded-full bg-sunny-100 flex items-center justify-center text-tangerine-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-sky-700/50">Location</p>
              <p className="font-semibold text-sky-900 text-sm truncate">
                {[student.district, student.block, student.cluster].filter(Boolean).join(' · ') || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {SUBJECTS.map((subject) => {
        const subjectReview = student.subjects?.[subject.key]
        return (
          <div key={subject.key} className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 sm:p-8">
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-sky-900 mb-1">
              {subject.label}
            </h2>
            <SquiggleUnderline className="w-28 h-3 mt-0.5 mb-4" color="#FFBE22" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {REVIEW_LEVELS.map((m) => {
                const isActive = subjectReview?.review === m.key
                const Icon = levelIcons[m.icon]
                return (
                  <div
                    key={`${subject.key}-${m.key}`}
                    className={`relative rounded-2xl sm:rounded-xl3 p-4 sm:p-5 flex flex-col items-center gap-2 border-2 text-center min-h-[8.5rem] ${
                      isActive
                        ? `border-transparent bg-gradient-to-br ${m.color} shadow-glow text-white`
                        : 'border-sky-100 bg-sky-50/40 text-sky-900 opacity-50'
                    }`}
                  >
                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-white shadow-soft'}`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : m.text}`} strokeWidth={2.25} />
                    </span>
                    <span className="font-heading font-bold text-sm sm:text-[15px] leading-snug">
                      {levelLabels[m.key]}
                    </span>
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white flex items-center justify-center shadow-soft">
                        <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${m.text}`} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-5 sm:mt-6">
              <p className="text-sm font-semibold text-sky-800/80 mb-2">Remarks</p>
              <div className="rounded-2xl border border-sky-200 bg-sky-50/60 px-4 py-3 text-sm text-sky-900 min-h-[4rem]">
                {subjectReview?.remarks || (subjectReview ? 'No remarks added.' : 'Review pending — no remarks yet.')}
              </div>
            </div>
          </div>
        )
      })}

      {completed && student.reviewDate && (
        <p className="text-xs text-sky-700/50">
          Reviewed on {typeof student.reviewDate === 'string' ? student.reviewDate.slice(0, 10) : String(student.reviewDate)}
        </p>
      )}
    </div>
  )
}
