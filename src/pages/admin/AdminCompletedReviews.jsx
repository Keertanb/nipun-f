import { useMemo, useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import { getCompletedReviews, districts, classList } from '../../data/mockData'

const PAGE_SIZE = 8

export default function AdminCompletedReviews() {
  const all = useMemo(() => getCompletedReviews(), [])
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('All')
  const [classFilter, setClassFilter] = useState('All')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return all
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      .filter((s) => district === 'All' || s.district === district)
      .filter((s) => classFilter === 'All' || s.class === classFilter)
  }, [all, search, district, classFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const reviewColor = { Good: 'text-good', Average: 'text-avg', Bad: 'text-bad' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-sky-900">Completed Reviews</h1>
        <p className="text-sky-800/60 text-sm mt-1">{all.length} reviews completed state-wide</p>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search student..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <select value={district} onChange={(e) => { setDistrict(e.target.value); setPage(1) }} className="rounded-full border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
          <option value="All">All Districts</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={classFilter} onChange={(e) => { setClassFilter(e.target.value); setPage(1) }} className="rounded-full border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
          <option value="All">All Classes</option>
          {classList.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {pageItems.map((s) => (
          <div key={s.id} className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5">
            <div className="flex items-start gap-3">
              <Avatar seed={s.avatarSeed} name={s.name} size={48} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-heading font-bold text-sky-900 truncate">{s.name}</p>
                  <Badge type="Completed">Completed</Badge>
                </div>
                <p className="text-xs text-sky-700/60">{s.class} &middot; {s.teacherName} &middot; {s.schoolName}</p>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className={`font-heading font-bold ${reviewColor[s.review]}`}>
                    {s.review === 'Good' ? '😁' : s.review === 'Average' ? '🙂' : '😞'} {s.review}
                  </span>
                  <span className="text-sky-700/50 text-xs">{s.reviewDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-sky-700/50">
          <p className="text-5xl mb-3">🗂️</p>
          <p className="font-heading font-bold">No reviews match your filters</p>
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="w-9 h-9 rounded-full bg-white border border-sky-200 flex items-center justify-center disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-sky-800/70">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="w-9 h-9 rounded-full bg-white border border-sky-200 flex items-center justify-center disabled:opacity-30">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
