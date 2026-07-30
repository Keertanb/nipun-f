import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Eye } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import { teachers, students, districts } from '../../data/mockData'

export default function AdminTeachers() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('All')

  const list = useMemo(() => {
    return teachers
      .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
      .filter((t) => district === 'All' || t.district === district)
      .map((t) => {
        const myStudents = students.filter((s) => s.teacherId === t.id)
        const completed = myStudents.filter((s) => s.status === 'Completed').length
        return { ...t, completed, pending: myStudents.length - completed, total: myStudents.length }
      })
  }, [search, district])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-sky-900">Teachers</h1>
        <p className="text-sky-800/60 text-sm mt-1">{teachers.length} teachers across {districts.length} districts</p>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teacher..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="rounded-full border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="All">All Districts</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5"
          >
            <div className="flex items-center gap-3">
              <Avatar seed={t.avatarSeed} name={t.name} size={52} />
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-sky-900 truncate">{t.name}</p>
                <p className="text-xs text-sky-700/60 truncate">{t.schoolName}</p>
              </div>
            </div>
            <p className="text-xs text-sky-700/50 mt-3">{t.district} &middot; {t.block} &middot; {t.cluster}</p>
            <div className="flex gap-2 mt-3">
              <Badge type="Completed">{t.completed} done</Badge>
              <Badge type="Pending">{t.pending} left</Badge>
            </div>
            <button
              onClick={() => navigate(`/admin/teachers/${t.id}/reviews`)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-sky-50 text-sky-700 font-semibold text-sm hover:bg-sky-100 transition-colors"
            >
              <Eye className="w-4 h-4" /> View Reviews
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
