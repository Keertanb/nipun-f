import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Clock, CheckCircle2 } from 'lucide-react'
import LocationFilters from '../../components/admin/LocationFilters'
import StatCard from '../../components/ui/StatCard'
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
  { key: 'Bad', label: 'ઉદયમાન', headerClass: 'bg-red-50 text-bad', cellClass: 'text-bad' },
  { key: 'Average', label: 'પ્રગતિશીલ', headerClass: 'bg-amber-50 text-avg', cellClass: 'text-avg' },
  { key: 'Good', label: 'નિપુણ', headerClass: 'bg-leaf-50 text-good', cellClass: 'text-good' },
]

const EMPTY_MATRIX = () => {
  const matrix = {}
  CLASS_ROWS.forEach(({ key }) => {
    matrix[key] = { Bad: 0, Average: 0, Good: 0 }
  })
  return matrix
}

export default function AdminDashboard() {
  const [filters, setFilters] = useState({
    districtId: '',
    blockId: '',
    clusterId: '',
    schoolId: '',
  })
  const [matrix, setMatrix] = useState(EMPTY_MATRIX)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!filters.schoolId) {
        setMatrix(EMPTY_MATRIX())
        setStudents([])
        setError('')
        return
      }
      setLoading(true)
      setError('')
      try {
        const data = await fetchSchoolStudents(filters.schoolId)
        if (cancelled) return
        setMatrix(data.matrix || EMPTY_MATRIX())
        setStudents(data.students || [])
      } catch (err) {
        if (cancelled) return
        setMatrix(EMPTY_MATRIX())
        setStudents([])
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

  const summary = useMemo(() => {
    const total = students.length
    const completed = students.filter((s) => s.status === 'Completed').length
    const pending = total - completed
    return { total, pending, completed }
  }, [students])

  const totals = useMemo(() => {
    const col = { Bad: 0, Average: 0, Good: 0 }
    CLASS_ROWS.forEach(({ key }) => {
      col.Bad += matrix[key]?.Bad || 0
      col.Average += matrix[key]?.Average || 0
      col.Good += matrix[key]?.Good || 0
    })
    return col
  }, [matrix])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-sky-900">Admin Control Center</h1>
        <p className="text-sky-800/60 text-sm mt-1">
          Class-wise review counts · ઉદયમાન · પ્રગતિશીલ · નિપુણ
        </p>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 sm:p-6">
        <LocationFilters value={filters} onChange={setFilters} requireSchool />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={loading ? '—' : summary.total}
          theme="sky"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Pending Students"
          value={loading ? '—' : summary.pending}
          theme="sunny"
          delay={0.05}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Students"
          value={loading ? '—' : summary.completed}
          theme="green"
          delay={0.1}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl3 shadow-card border border-sky-100 overflow-hidden"
      >
        <div className="px-4 sm:px-6 py-4 border-b border-sky-100 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-heading font-bold text-sky-900">Review Status by Class</h2>
          <p className="text-xs text-sky-700/50">
            {!filters.schoolId
              ? 'Select a school to load counts'
              : loading
                ? 'Loading…'
                : `${summary.total} students in school`}
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
