import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, School, MapPin, GraduationCap, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { schools, teachers, students, districts } from '../../data/mockData'

export default function AdminSchools() {
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('All')

  const list = useMemo(() => {
    return schools
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      .filter((s) => district === 'All' || s.district === district)
      .map((s) => ({
        ...s,
        teacherCount: teachers.filter((t) => t.schoolId === s.id).length,
        studentCount: students.filter((st) => st.schoolId === s.id).length,
      }))
  }, [search, district])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-sky-900">Schools</h1>
          <p className="text-sky-800/60 text-sm mt-1">{schools.length} government schools onboarded</p>
        </div>
        <Link
          to="/admin/school-tree"
          className="text-sm font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-full transition-colors"
        >
          View Hierarchical Tree &rarr;
        </Link>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search school..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <select value={district} onChange={(e) => setDistrict(e.target.value)} className="rounded-full border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
          <option value="All">All Districts</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-soft mb-3">
              <School className="w-5 h-5 text-white" />
            </div>
            <p className="font-heading font-bold text-sky-900">{s.name}</p>
            <p className="text-xs text-sky-700/50 mt-1">Code: {s.code}</p>
            <p className="text-xs text-sky-700/60 flex items-center gap-1.5 mt-2">
              <MapPin className="w-3.5 h-3.5" /> {s.district} &middot; {s.block} &middot; {s.cluster}
            </p>
            <div className="flex gap-4 mt-4 pt-4 border-t border-sky-50">
              <span className="text-xs flex items-center gap-1.5 text-sky-700/70"><GraduationCap className="w-4 h-4" /> {s.teacherCount} teachers</span>
              <span className="text-xs flex items-center gap-1.5 text-sky-700/70"><Users className="w-4 h-4" /> {s.studentCount} students</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
