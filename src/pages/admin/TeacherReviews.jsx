import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import { teachers, students, classList } from '../../data/mockData'

export default function TeacherReviews() {
  const { teacherId } = useParams()
  const navigate = useNavigate()
  const teacher = teachers.find((t) => t.id === teacherId)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [reviewFilter, setReviewFilter] = useState('All')

  const list = useMemo(() => {
    return students
      .filter((s) => s.teacherId === teacherId && s.status === 'Completed')
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      .filter((s) => classFilter === 'All' || s.class === classFilter)
      .filter((s) => reviewFilter === 'All' || s.review === reviewFilter)
      .sort((a, b) => (a.reviewDate < b.reviewDate ? 1 : -1))
  }, [teacherId, search, classFilter, reviewFilter])

  if (!teacher) return null
  const reviewColor = { Good: 'text-good', Average: 'text-avg', Bad: 'text-bad' }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sky-700 font-semibold text-sm hover:text-sky-900">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-6 flex items-center gap-4">
        <Avatar seed={teacher.avatarSeed} name={teacher.name} size={64} />
        <div>
          <h1 className="font-heading font-extrabold text-xl text-sky-900">{teacher.name}</h1>
          <p className="text-sky-800/60 text-sm">{teacher.schoolName} &middot; {teacher.district}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="rounded-full border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
          <option value="All">All Classes</option>
          {classList.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)} className="rounded-full border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
          <option value="All">All Reviews</option>
          <option value="Good">Good</option>
          <option value="Average">Average</option>
          <option value="Bad">Bad</option>
        </select>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 text-sky-700/50">
          <p className="text-5xl mb-3">🗂️</p>
          <p className="font-heading font-bold">No reviews match your filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {list.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5"
            >
              <div className="flex items-start gap-3">
                <Avatar seed={s.avatarSeed} name={s.name} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-heading font-bold text-sky-900 truncate">{s.name}</p>
                    <Badge type="Completed">Completed</Badge>
                  </div>
                  <p className="text-xs text-sky-700/60">{s.class} &middot; Roll #{s.rollNo}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className={`font-heading font-bold ${reviewColor[s.review]}`}>
                      {s.review === 'Good' ? '😁' : s.review === 'Average' ? '🙂' : '😞'} {s.review}
                    </span>
                    <span className="text-sky-700/50 text-xs">{s.reviewDate}</span>
                  </div>
                  {s.remarks && <p className="text-xs text-sky-800/60 mt-2 italic">&ldquo;{s.remarks}&rdquo;</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
