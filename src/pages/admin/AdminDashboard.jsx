import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Clock,
  CheckCircle2,
  BookOpen,
  BarChart3,
  PieChart as PieIcon,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'
import LocationFilters from '../../components/admin/LocationFilters'
import StatCard from '../../components/ui/StatCard'
import ProgressBar from '../../components/ui/ProgressBar'
import { fetchSchoolStudents } from '../../api/master'

const CLASS_ROWS = [
  { key: 'Balvatika', label: 'Balvatika' },
  { key: 'Std 1', label: 'Std-1' },
  { key: 'Std 2', label: 'Std-2' },
  { key: 'Std 3', label: 'Std-3' },
  { key: 'Std 4', label: 'Std-4' },
  { key: 'Std 5', label: 'Std-5' },
]

const REVIEW_COLS = [
  { key: 'Bad', label: 'ઉદયમાન', color: '#EF4444', headerClass: 'bg-red-50 text-bad', cellClass: 'text-bad' },
  { key: 'Average', label: 'પ્રગતિશીલ', color: '#F59E0B', headerClass: 'bg-amber-50 text-avg', cellClass: 'text-avg' },
  { key: 'Good', label: 'નિપુણ', color: '#22B566', headerClass: 'bg-leaf-50 text-good', cellClass: 'text-good' },
]

const SUBJECT_OPTIONS = [
  { value: 'All', label: 'All Subjects' },
  { value: 'Gujarati', label: 'Gujarati' },
  { value: 'Maths', label: 'Maths' },
]

const selectClass =
  'w-full sm:w-auto min-w-[180px] rounded-2xl border border-sky-200 bg-white px-4 py-2.5 text-sm text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400'

const EMPTY_MATRIX = () => {
  const matrix = {}
  CLASS_ROWS.forEach(({ key }) => {
    matrix[key] = { Bad: 0, Average: 0, Good: 0 }
  })
  return matrix
}

function buildMatrix(students, subjectFilter) {
  const matrix = EMPTY_MATRIX()
  const subjects = subjectFilter === 'All' ? ['Gujarati', 'Maths'] : [subjectFilter]

  students.forEach((s) => {
    const cls = s.class
    if (!matrix[cls]) return
    subjects.forEach((subject) => {
      const rating = s.subjects?.[subject]?.review
      if (rating && matrix[cls][rating] != null) matrix[cls][rating] += 1
    })
  })
  return matrix
}

function subjectStats(students, subjectFilter) {
  if (subjectFilter === 'All') {
    const total = students.length
    const completed = students.filter((s) => s.status === 'Completed').length
    return { total, completed, pending: total - completed }
  }

  const total = students.length
  const completed = students.filter((s) => Boolean(s.subjects?.[subjectFilter]?.review)).length
  return { total, completed, pending: total - completed }
}

export default function AdminDashboard() {
  const [filters, setFilters] = useState({
    districtId: '',
    blockId: '',
    clusterId: '',
    schoolId: '',
  })
  const [subject, setSubject] = useState('All')
  const [students, setStudents] = useState([])
  const [round, setRound] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!filters.schoolId) {
        setStudents([])
        setRound(null)
        setError('')
        return
      }
      setLoading(true)
      setError('')
      try {
        const data = await fetchSchoolStudents(filters.schoolId)
        if (cancelled) return
        setStudents(data.students || [])
        setRound(data.round || null)
      } catch (err) {
        if (cancelled) return
        setStudents([])
        setRound(null)
        setError(err.message || 'Failed to load school review counts')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [filters.schoolId])

  const matrix = useMemo(() => buildMatrix(students, subject), [students, subject])
  const summary = useMemo(() => subjectStats(students, subject), [students, subject])

  const totals = useMemo(() => {
    const col = { Bad: 0, Average: 0, Good: 0 }
    CLASS_ROWS.forEach(({ key }) => {
      col.Bad += matrix[key]?.Bad || 0
      col.Average += matrix[key]?.Average || 0
      col.Good += matrix[key]?.Good || 0
    })
    return col
  }, [matrix])

  const completionPct = summary.total
    ? Math.round((summary.completed / summary.total) * 100)
    : 0

  const completionPie = useMemo(
    () => [
      { name: 'Completed', value: summary.completed, color: '#22B566' },
      { name: 'Pending', value: summary.pending, color: '#F59E0B' },
    ],
    [summary],
  )

  const levelPie = useMemo(
    () =>
      REVIEW_COLS.map((col) => ({
        name: col.label,
        value: totals[col.key],
        color: col.color,
      })).filter((d) => d.value > 0),
    [totals],
  )

  const classBarData = useMemo(
    () =>
      CLASS_ROWS.map(({ key, label }) => ({
        name: label,
        Emerging: matrix[key]?.Bad || 0,
        Progressive: matrix[key]?.Average || 0,
        Proficient: matrix[key]?.Good || 0,
      })),
    [matrix],
  )

  const classCompletion = useMemo(
    () =>
      CLASS_ROWS.map(({ key, label }) => {
        const inClass = students.filter((s) => s.class === key)
        const total = inClass.length
        let completed = 0
        if (subject === 'All') {
          completed = inClass.filter((s) => s.status === 'Completed').length
        } else {
          completed = inClass.filter((s) => Boolean(s.subjects?.[subject]?.review)).length
        }
        return {
          class: label,
          total,
          completed,
          pending: total - completed,
          pct: total ? Math.round((completed / total) * 100) : 0,
        }
      }).filter((row) => row.total > 0),
    [students, subject],
  )

  const subjectCompare = useMemo(() => {
    const gujDone = students.filter((s) => Boolean(s.subjects?.Gujarati?.review)).length
    const mathsDone = students.filter((s) => Boolean(s.subjects?.Maths?.review)).length
    const total = students.length || 1
    return [
      {
        subject: 'Gujarati',
        Reviewed: gujDone,
        Pending: Math.max(students.length - gujDone, 0),
        pct: Math.round((gujDone / total) * 100),
      },
      {
        subject: 'Maths',
        Reviewed: mathsDone,
        Pending: Math.max(students.length - mathsDone, 0),
        pct: Math.round((mathsDone / total) * 100),
      },
    ]
  }, [students])

  const subjectLabel =
    subject === 'All' ? 'both subjects' : subject === 'Gujarati' ? 'Gujarati' : 'Maths'

  const completedCardLabel =
    subject === 'All' ? 'Completed Students' : `${subject} Reviewed`
  const pendingCardLabel =
    subject === 'All' ? 'Pending Students' : `${subject} Pending`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-sky-900">Admin Control Center</h1>
        <p className="text-sky-800/60 text-sm mt-1">
          Class-wise review counts · ઉદયમાન · પ્રગતિશીલ · નિપુણ
          {round?.roundNumber ? ` · Round ${round.roundNumber}` : ''}
        </p>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 sm:p-6 space-y-4">
        <LocationFilters value={filters} onChange={setFilters} requireSchool />
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 pt-1 border-t border-sky-50">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-sky-700/60 uppercase tracking-wide">Subject</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={selectClass}
              disabled={!filters.schoolId}
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <p className="text-xs text-sky-700/50 pb-2">
            Counts and charts update for {subjectLabel}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={loading ? '—' : summary.total}
          theme="sky"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label={pendingCardLabel}
          value={loading ? '—' : summary.pending}
          theme="sunny"
          delay={0.05}
        />
        <StatCard
          icon={CheckCircle2}
          label={completedCardLabel}
          value={loading ? '—' : summary.completed}
          theme="green"
          delay={0.1}
        />
        <StatCard
          icon={BookOpen}
          label="Completion %"
          value={loading ? '—' : `${completionPct}%`}
          theme="sky"
          delay={0.15}
        />
      </div>

      {filters.schoolId && !loading && !error && students.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="w-4 h-4 text-sky-600" />
              <h3 className="font-heading font-bold text-sky-900">
                {subject === 'All' ? 'Overall Completion' : `${subject} Completion`}
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={completionPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {completionPie.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-good inline-block" /> Completed ({summary.completed})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-avg inline-block" /> Pending ({summary.pending})
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <h3 className="font-heading font-bold text-sky-900">
                Level Mix · {subject === 'All' ? 'Both Subjects' : subject}
              </h3>
            </div>
            {levelPie.length === 0 ? (
              <p className="text-sm text-sky-700/50 py-16 text-center">No reviews yet for this filter</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={levelPie}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {levelPie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="flex flex-wrap justify-center gap-4 text-sm mt-1">
              {REVIEW_COLS.map((col) => (
                <span key={col.key} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: col.color }} />
                  {col.label} ({totals[col.key]})
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5 lg:col-span-2"
          >
            <h3 className="font-heading font-bold text-sky-900 mb-4">
              Class-wise Levels · {subject === 'All' ? 'Both Subjects' : subject}
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={classBarData} margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E0F2FE" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Emerging" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Progressive" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Proficient" stackId="a" fill="#22B566" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5 space-y-4"
          >
            <h3 className="font-heading font-bold text-sky-900">
              Class Completion · {subject === 'All' ? 'Both Subjects' : subject}
            </h3>
            {classCompletion.length === 0 ? (
              <p className="text-sm text-sky-700/50 py-8 text-center">No class data</p>
            ) : (
              classCompletion.map((row) => (
                <ProgressBar
                  key={row.class}
                  pct={row.pct}
                  label={`${row.class} · ${row.completed}/${row.total}`}
                  color="green"
                />
              ))
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5"
          >
            <h3 className="font-heading font-bold text-sky-900 mb-4">Subject Comparison</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={subjectCompare} margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E0F2FE" />
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Reviewed" fill="#22A3F5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Pending" fill="#FFBE22" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center text-sm">
              {subjectCompare.map((s) => (
                <div key={s.subject} className="rounded-2xl bg-sky-50 px-3 py-2">
                  <p className="font-heading font-bold text-sky-900">{s.subject}</p>
                  <p className="text-sky-700/60 text-xs mt-0.5">{s.pct}% reviewed</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl3 shadow-card border border-sky-100 overflow-hidden"
      >
        <div className="px-4 sm:px-6 py-4 border-b border-sky-100 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-heading font-bold text-sky-900">
            Review Status by Class
            <span className="ml-2 text-xs font-semibold text-sky-700/50">
              · {subject === 'All' ? 'All Subjects' : subject}
            </span>
          </h2>
          <p className="text-xs text-sky-700/50">
            {!filters.schoolId
              ? 'Select a school to load counts'
              : loading
                ? 'Loading…'
                : `${summary.total} students · ${summary.completed} ${subject === 'All' ? 'fully completed' : 'reviewed'}`}
          </p>
        </div>

        {error ? (
          <div className="px-4 sm:px-6 py-8 text-center text-sm text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="border-b border-sky-100">
                  <th className="px-4 sm:px-6 py-3.5 text-left text-xs font-semibold text-sky-700/50 uppercase tracking-wide">
                    Class
                  </th>
                  {REVIEW_COLS.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 sm:px-6 py-3.5 text-center text-sm font-heading font-bold ${col.headerClass}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLASS_ROWS.map(({ key, label }) => {
                  const row = matrix[key] || { Bad: 0, Average: 0, Good: 0 }
                  return (
                    <tr key={key} className="border-b border-sky-50 last:border-0 hover:bg-sky-50/40">
                      <td className="px-4 sm:px-6 py-3.5 font-heading font-bold text-sky-900">
                        {label}
                      </td>
                      {REVIEW_COLS.map((col) => (
                        <td
                          key={col.key}
                          className={`px-4 sm:px-6 py-3.5 text-center font-heading font-extrabold text-base ${col.cellClass}`}
                        >
                          {loading ? '—' : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  )
                })}
                <tr className="bg-sky-50/70 border-t-2 border-sky-100">
                  <td className="px-4 sm:px-6 py-4 font-heading font-extrabold text-sky-900">
                    Total
                  </td>
                  {REVIEW_COLS.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 sm:px-6 py-4 text-center font-heading font-extrabold text-lg ${col.cellClass}`}
                    >
                      {loading ? '—' : totals[col.key]}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
