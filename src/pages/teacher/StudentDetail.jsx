import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ArrowLeft,
  School,
  GraduationCap,
  CheckCircle2,
  Sprout,
  TrendingUp,
  Award,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useReviews } from '../../context/ReviewContext'
import { useLanguage } from '../../context/LanguageContext'
import { REVIEW_LEVELS } from '../../i18n/translations'
import { Star as StarDoodle, Balloon, ABCBlock, SquiggleUnderline, Kid, SolidShape, Crayon } from '../../components/illustrations/Doodles'

const SUBJECTS = [
  { key: 'Gujarati', labelKey: 'subjectGujarati' },
  { key: 'Maths', labelKey: 'subjectMaths' },
]

const levelIcons = {
  sprout: Sprout,
  trending: TrendingUp,
  award: Award,
}

function emptySubjectState(saved) {
  return {
    review: saved?.review || null,
    remarks: saved?.remarks || '',
  }
}

export default function StudentDetail() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { students, submitReview, loading, error, reloadStudents, canSubmit, round } = useReviews()
  const student = useMemo(() => students.find((s) => s.id === studentId), [students, studentId])

  const [bySubject, setBySubject] = useState({
    Gujarati: { review: null, remarks: '' },
    Maths: { review: null, remarks: '' },
  })
  const [submitted, setSubmitted] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const roundClosed = !canSubmit
  const bothSelected = SUBJECTS.every((s) => Boolean(bySubject[s.key]?.review))
  const formLocked = submitted || saving || roundClosed

  useEffect(() => {
    if (!student) return
    setBySubject({
      Gujarati: emptySubjectState(student.subjects?.Gujarati),
      Maths: emptySubjectState(student.subjects?.Maths),
    })
    setSubmitted(student.status === 'Completed')
  }, [student])

  if (loading) {
    return <p className="text-sky-800/60 text-sm py-20 text-center">{t('loadingStudent')}</p>
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-sm mb-3">{error}</p>
        <Button onClick={reloadStudents}>{t('retry')}</Button>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="font-heading font-bold text-sky-900">{t('studentNotFound')}</p>
        <Button className="mt-5" onClick={() => navigate(-1)}>{t('goBack')}</Button>
      </div>
    )
  }

  function setSubjectReview(subject, review) {
    if (formLocked) return
    setBySubject((prev) => ({
      ...prev,
      [subject]: { ...prev[subject], review },
    }))
  }

  function setSubjectRemarks(subject, remarks) {
    if (formLocked) return
    setBySubject((prev) => ({
      ...prev,
      [subject]: { ...prev[subject], remarks },
    }))
  }

  async function handleSubmit() {
    if (!bothSelected || saving || submitted || roundClosed) return
    setSaving(true)
    setSaveError('')
    try {
      const result = await submitReview(student.id, {
        reviews: SUBJECTS.map((s) => ({
          subject: s.key,
          review: bySubject[s.key].review,
          remarks: bySubject[s.key].remarks || '',
        })),
      })
      const done = result.status === 'Completed' || result.isDone
      setSubmitted(done)
      if (done) {
        setCelebrate(true)
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22A3F5', '#22B566', '#FFBE22', '#FA5411'],
        })
        setTimeout(() => confetti({ particleCount: 60, angle: 100, origin: { y: 0.5, x: 0.2 } }), 200)
        setTimeout(() => confetti({ particleCount: 60, angle: 120, origin: { y: 0.5, x: 0.8 } }), 400)
        setTimeout(() => navigate('/teacher', { replace: true }), 1200)
      } else {
        setSaving(false)
      }
    } catch (err) {
      setSaveError(err.message || t('roundSubmissionOver'))
      setSaving(false)
    }
  }

  const genderLabel =
    student.gender === 'Boy' || student.gender === 'M' || student.gender === 'Male'
      ? t('boy')
      : student.gender === 'Girl' || student.gender === 'F' || student.gender === 'Female'
        ? t('girl')
        : student.gender

  return (
    <div className="relative space-y-6 max-w-3xl mx-auto">
      <div
        className="hidden xl:block fixed -left-12 top-3/4 -translate-y-1/2 w-72 h-72 2xl:w-96 2xl:h-96 opacity-50 pointer-events-none"
        style={{
          backgroundImage: "url('/images/kids-watermark.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          maskImage: 'radial-gradient(ellipse 62% 62% at 50% 42%, black 45%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(ellipse 62% 62% at 50% 42%, black 45%, transparent 82%)',
        }}
        aria-hidden="true"
      />

      <Kid className="w-14 h-20 top-24 -left-28 hidden 2xl:block" color="#FF9C6E" />
      <SolidShape shape="circle" className="w-9 h-9 top-[30rem] -left-24 hidden xl:block opacity-70" color="#43CD82" />
      <ABCBlock className="w-8 h-8 top-8 -right-20 hidden xl:block" letter="R" color="#22B566" />
      <Crayon className="w-6 h-16 top-[20rem] -right-16 hidden xl:block" color="#FA5411" />
      <SolidShape shape="square" className="w-7 h-7 top-[36rem] -right-24 hidden xl:block opacity-70" color="#FFBE22" />

      <button
        onClick={() => navigate('/teacher')}
        className="flex items-center gap-2 text-sky-700 font-semibold text-sm hover:text-sky-900"
      >
        <ArrowLeft className="w-4 h-4" /> {t('back')}
      </button>

      {roundClosed && (
        <div className="rounded-2xl border border-tangerine-200 bg-tangerine-50 px-4 py-3 text-sm font-semibold text-tangerine-800">
          {t('roundSubmissionOver')}
          {round?.roundNumber ? (
            <span className="block text-xs font-medium text-tangerine-700/80 mt-1">
              {t('reviewRound')} {round.roundNumber}
              {round.endDate ? ` · ${round.startDate} → ${round.endDate}` : ''}
            </span>
          ) : null}
        </div>
      )}

      {!roundClosed && round?.roundNumber ? (
        <p className="text-xs font-semibold text-sky-700/60">
          {t('reviewRound')} {round.roundNumber}
          {round.endDate ? ` · ${round.startDate} → ${round.endDate}` : ''}
        </p>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-sky-600 to-leaf-600 rounded-xl3 shadow-soft p-4 sm:p-8 text-white"
      >
        <div className="absolute -top-10 -right-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/10" />
        <StarDoodle className="w-5 h-5 sm:w-6 sm:h-6 top-4 right-16 sm:right-24" color="#FFE58A" delay={0.3} />
        <Balloon className="w-7 h-14 -top-2 right-6 hidden sm:block" color="#FFD24D" delay={0.6} />

        <div className="relative flex items-start sm:items-center gap-4 sm:gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl break-words">{student.name}</h1>
              <Badge type={submitted ? 'Completed' : 'Pending'} className="!bg-white/95 shadow-soft">
                {submitted ? t('completed') : t('pending')}
              </Badge>
            </div>
            <p className="text-white/80 text-xs sm:text-sm mt-1">
              {t('rollNo')} {student.rollNo} &middot; {student.class} &middot; {genderLabel}
              {student.age != null ? ` · ${t('age')} ${student.age}` : ''}
            </p>
            <p className="text-white/70 text-xs mt-2">{t('bothSubjectsRequired')}</p>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0"><GraduationCap className="w-5 h-5" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-sky-700/50">{t('teacher')}</p>
              <p className="font-semibold text-sky-900 text-sm truncate">{student.teacherName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-leaf-100 flex items-center justify-center text-leaf-600 shrink-0"><School className="w-5 h-5" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-sky-700/50">{t('school')}</p>
              <p className="font-semibold text-sky-900 text-sm truncate">{student.schoolName}</p>
            </div>
          </div>
        </div>
      </div>

      {SUBJECTS.map((subject) => {
        const state = bySubject[subject.key]
        return (
          <div
            key={subject.key}
            className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-dots -z-10" />
            <div className="flex items-center justify-between gap-3 mb-1">
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-sky-900">
                {t(subject.labelKey)}
              </h2>
              {state.review ? (
                <span className="inline-flex items-center gap-1 text-xs font-heading font-bold text-leaf-700 bg-leaf-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('selected')}
                </span>
              ) : null}
            </div>
            <SquiggleUnderline className="w-28 h-3 mt-0.5 mb-2" color="#FFBE22" />
            <p className="text-sky-800/60 text-xs sm:text-sm mb-4 sm:mb-6">{t('pickSubjectPerformance')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {REVIEW_LEVELS.map((m) => {
                const isActive = state.review === m.key
                const Icon = levelIcons[m.icon]
                return (
                  <motion.button
                    key={`${subject.key}-${m.key}`}
                    type="button"
                    disabled={formLocked}
                    onClick={() => setSubjectReview(subject.key, m.key)}
                    whileHover={!formLocked ? { scale: 1.03, y: -3 } : {}}
                    whileTap={!formLocked ? { scale: 0.97 } : {}}
                    className={`relative rounded-2xl sm:rounded-xl3 p-4 sm:p-5 flex flex-col items-center gap-2 border-2 transition-all text-center min-h-[8.5rem] ${
                      isActive
                        ? `border-transparent bg-gradient-to-br ${m.color} shadow-glow text-white`
                        : 'border-sky-100 bg-sky-50/40 text-sky-900 hover:border-sky-200'
                    } ${formLocked && !isActive ? 'opacity-40' : ''} ${formLocked ? 'pointer-events-none cursor-not-allowed' : ''}`}
                    aria-disabled={formLocked}
                  >
                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-white shadow-soft'}`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : m.text}`} strokeWidth={2.25} />
                    </span>
                    <span className="font-heading font-bold text-sm sm:text-[15px] leading-snug">
                      {t(m.labelKey)}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white flex items-center justify-center shadow-soft"
                      >
                        <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${m.text}`} />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            <div className="mt-5 sm:mt-6">
              <label className="text-sm font-semibold text-sky-800/80 mb-2 block">{t('optionalRemarks')}</label>
              <textarea
                disabled={formLocked}
                value={state.remarks}
                onChange={(e) => setSubjectRemarks(subject.key, e.target.value)}
                rows={3}
                placeholder={t('remarksPlaceholder')}
                className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-sky-50/60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        )
      })}

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 sm:p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {roundClosed && !submitted ? (
            <div className="flex items-center gap-2 text-tangerine-700 font-heading font-bold">
              {t('roundSubmissionOver')}
            </div>
          ) : !submitted ? (
            <Button
              size="lg"
              disabled={!bothSelected || saving || roundClosed}
              onClick={handleSubmit}
              className={`w-full sm:w-auto ${!bothSelected || saving || roundClosed ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {saving ? t('saving') : t('submitReview')}
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-good font-heading font-bold">
              <CheckCircle2 className="w-6 h-6 shrink-0" /> {t('reviewSubmitted')}
            </div>
          )}
          {!submitted && !saving && !roundClosed && (
            <p className="text-xs text-sky-700/50">{t('bothSubjectsHint')}</p>
          )}
        </div>
        {saveError ? <p className="mt-3 text-sm text-red-600">{saveError}</p> : null}

        <AnimatePresence>
          {celebrate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className="text-center px-4"
              >
                <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-leaf-100 text-leaf-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="font-heading font-extrabold text-2xl text-sky-900">{t('greatWork')}</p>
                <p className="text-sky-800/60 text-sm mt-1">{t('reviewSaved', { name: student.name })}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
