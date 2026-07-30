import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { ArrowLeft, School, GraduationCap, CheckCircle2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useReviews } from '../../context/ReviewContext'
import { Star as StarDoodle, Balloon, ABCBlock, SquiggleUnderline, Kid, SolidShape, Crayon } from '../../components/illustrations/Doodles'

const moods = [
  { key: 'Bad', emoji: '😞', label: 'Bad', color: 'from-red-400 to-bad', ring: 'ring-bad', text: 'text-bad' },
  { key: 'Average', emoji: '🙂', label: 'Average', color: 'from-amber-300 to-avg', ring: 'ring-avg', text: 'text-avg' },
  { key: 'Good', emoji: '😁', label: 'Good', color: 'from-leaf-400 to-good', ring: 'ring-good', text: 'text-good' },
]

export default function StudentDetail() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { students, submitReview, loading, error, reloadStudents } = useReviews()
  const student = useMemo(() => students.find((s) => s.id === studentId), [students, studentId])

  const [selected, setSelected] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!student) return
    setSelected(student.review || null)
    setRemarks(student.remarks || '')
    setSubmitted(student.status === 'Completed')
  }, [student])

  if (loading) {
    return <p className="text-sky-800/60 text-sm py-20 text-center">Loading student…</p>
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-sm mb-3">{error}</p>
        <Button onClick={reloadStudents}>Retry</Button>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-3">🤔</p>
        <p className="font-heading font-bold text-sky-900">Student not found</p>
        <Button className="mt-5" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  async function handleSubmit() {
    if (!selected || saving) return
    setSaving(true)
    setSaveError('')
    try {
      await submitReview(student.id, { review: selected, remarks })
      setSubmitted(true)
      setCelebrate(true)
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22A3F5', '#22B566', '#FFBE22', '#FA5411'],
      })
      setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.2 } }), 200)
      setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.8 } }), 400)
      setTimeout(() => setCelebrate(false), 2600)
    } catch (err) {
      setSaveError(err.message || 'Failed to save review')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative space-y-6 max-w-3xl mx-auto">
      {/* Kids reading — pinned to the viewport (not the page), matching the
          same watermark on the Dashboard and Students list pages. */}
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

      {/* Extra scattered shapes in the wide side margins */}
      <Kid className="w-14 h-20 top-24 -left-28 hidden 2xl:block" color="#FF9C6E" />
      <SolidShape shape="circle" className="w-9 h-9 top-[30rem] -left-24 hidden xl:block opacity-70" color="#43CD82" />
      <ABCBlock className="w-8 h-8 top-8 -right-20 hidden xl:block" letter="R" color="#22B566" />
      <Crayon className="w-6 h-16 top-[20rem] -right-16 hidden xl:block" color="#FA5411" />
      <SolidShape shape="square" className="w-7 h-7 top-[36rem] -right-24 hidden xl:block opacity-70" color="#FFBE22" />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sky-700 font-semibold text-sm hover:text-sky-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Profile hero */}
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
              <Badge type={submitted ? 'Completed' : 'Pending'} className="!bg-white/95 shadow-soft">{submitted ? 'Completed' : 'Pending'}</Badge>
            </div>
            <p className="text-white/80 text-xs sm:text-sm mt-1">Roll No. {student.rollNo} &middot; {student.class} &middot; {student.gender}{student.age != null ? ` · Age ${student.age}` : ''}</p>
          </div>
        </div>
      </motion.div>

      {/* Details card */}
      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0"><GraduationCap className="w-5 h-5" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-sky-700/50">Teacher</p>
              <p className="font-semibold text-sky-900 text-sm truncate">{student.teacherName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-leaf-100 flex items-center justify-center text-leaf-600 shrink-0"><School className="w-5 h-5" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-sky-700/50">School</p>
              <p className="font-semibold text-sky-900 text-sm truncate">{student.schoolName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment */}
      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dots -z-10" />
        <ABCBlock className="w-7 h-7 sm:w-8 sm:h-8 top-3 right-3 sm:top-4 sm:right-6" letter="A" color="#22A3F5" delay={0.4} />
        <h2 className="font-heading font-extrabold text-lg sm:text-xl text-sky-900 mb-1">Overall Student Performance</h2>
        <SquiggleUnderline className="w-28 h-3 mt-0.5 mb-2" color="#FFBE22" />
        <p className="text-sky-800/60 text-xs sm:text-sm mb-4 sm:mb-6">Pick the option that best describes this student's overall performance.</p>

        <div className="grid grid-cols-3 gap-2 sm:gap-5">
          {moods.map((m) => {
            const isActive = selected === m.key
            return (
              <motion.button
                key={m.key}
                disabled={submitted}
                onClick={() => setSelected(m.key)}
                whileHover={!submitted ? { scale: 1.05, y: -4 } : {}}
                whileTap={!submitted ? { scale: 0.96 } : {}}
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.4 }}
                className={`relative rounded-2xl sm:rounded-xl3 p-3 sm:p-7 flex flex-col items-center gap-1 sm:gap-2 border-2 transition-all ${
                  isActive
                    ? `border-transparent bg-gradient-to-br ${m.color} shadow-glow text-white`
                    : 'border-sky-100 bg-sky-50/40 text-sky-900 hover:border-sky-200'
                } ${submitted && !isActive ? 'opacity-40' : ''} disabled:cursor-not-allowed`}
              >
                <span className="text-3xl sm:text-5xl">{m.emoji}</span>
                <span className="font-heading font-bold text-xs sm:text-base">{m.label}</span>
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
          <label className="text-sm font-semibold text-sky-800/80 mb-2 block">Optional Remarks</label>
          <textarea
            disabled={submitted}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            placeholder="Add any additional observation about this student..."
            className="w-full rounded-2xl border border-sky-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-sky-50/60"
          />
        </div>

        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
          {!submitted ? (
            <Button size="lg" disabled={!selected || saving} onClick={handleSubmit} className={`w-full sm:w-auto ${!selected || saving ? 'opacity-40 cursor-not-allowed' : ''}`}>
              {saving ? 'Saving…' : 'Submit Review'}
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-good font-heading font-bold">
              <CheckCircle2 className="w-6 h-6 shrink-0" /> Review submitted &mdash; great job! 🎉
            </div>
          )}
          {!submitted && <p className="text-xs text-sky-700/50">Only one option can be selected.</p>}
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
                className="text-center"
              >
                <p className="text-6xl mb-2">🎉</p>
                <p className="font-heading font-extrabold text-2xl text-sky-900">Great work!</p>
                <p className="text-sky-800/60 text-sm">{student.name}'s review has been saved.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
