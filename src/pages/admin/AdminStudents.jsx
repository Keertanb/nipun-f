import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import { students, districts, classList } from '../../data/mockData'

export default function AdminStudents() {
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const list = useMemo(() => {
    return students
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      .filter((s) => district === 'All' || s.district === district)
      .filter((s) => classFilter === 'All' || s.class === classFilter)
      .filter((s) => statusFilter === 'All' || s.status === statusFilter)
      .slice(0, 60)
  }, [search, district, classFilter, statusFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-sky-900">Students</h1>
        <p className="text-sky-800/60 text-sm mt-1">{students.length} students across Gujarat &middot; showing top 60 matches</p>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <select value={district} onChange={(e) => setDistrict(e.target.value)} className="rounded-full border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
          <option value="All">All Districts</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="rounded-full border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
          <option value="All">All Classes</option>
          {classList.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-full border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-sky-700/50 border-b border-sky-100">
              <th className="px-5 py-3 font-semibold">Student</th>
              <th className="px-5 py-3 font-semibold">Class</th>
              <th className="px-5 py-3 font-semibold">School</th>
              <th className="px-5 py-3 font-semibold">District</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-b border-sky-50 last:border-0 hover:bg-sky-50/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar seed={s.avatarSeed} name={s.name} size={34} />
                    <span className="font-semibold text-sky-900">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sky-800/70">{s.class}</td>
                <td className="px-5 py-3 text-sky-800/70 max-w-[220px] truncate">{s.schoolName}</td>
                <td className="px-5 py-3 text-sky-800/70">{s.district}</td>
                <td className="px-5 py-3"><Badge type={s.status}>{s.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <div className="text-center py-16 text-sky-700/50">
            <p className="text-5xl mb-3">🔍</p>
            <p className="font-heading font-bold">No students match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
