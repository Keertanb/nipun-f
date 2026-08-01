import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronLeft, ChevronRight, Sprout, TrendingUp, Award } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../context/AuthContext'
import { useReviews } from '../../context/ReviewContext'
import { useLanguage } from '../../context/LanguageContext'
import { classesFromStudents, CLASS_LIST } from '../../constants/classes'
import { REVIEW_LEVELS } from '../../i18n/translations'

const PAGE_SIZE = 6

const levelIcons = { sprout: Sprout, trending: TrendingUp, award: Award }

export default function CompletedReviews() {
  const { user } = useAuth()
  const { students, loading, error, reloadStudents } = useReviews()
  const { t } = useLanguage()
  const teacher = user?.teacher
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [page, setPage] = useState(1)

  const classOptions = useMemo(() => {
    const list = classesFromStudents(students, teacher?.classesAssigned || [])
    return list.length ? list : CLASS_LIST
  }, [students, teacher?.classesAssigned])

  const completed = useMemo(() => {
    return students
      .filter((s) => (!teacher?.id || s.teacherId === teacher.id) && s.status === 'Completed')
      .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      .filter((s) => classFilter === 'All' || s.class === classFilter)
      .sort((a, b) => (a.reviewDate < b.reviewDate ? 1 : -1))
  }, [students, teacher, search, classFilter])

  const totalPages = Math.max(1, Math.ceil(completed.length / PAGE_SIZE))
  const pageItems = completed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const reviewColor = { Good: 'text-good', Average: 'text-avg', Bad: 'text-bad' }

  function reviewLabel(key) {
    const level = REVIEW_LEVELS.find((l) => l.key === key)
    return level ? t(level.shortKey) : key
  }

  function ReviewIcon({ reviewKey }) {
    const level = REVIEW_LEVELS.find((l) => l.key === reviewKey)
    const Icon = levelIcons[level?.icon] || Award
    return <Icon className={`w-4 h-4 ${reviewColor[reviewKey] || 'text-sky-600'}`} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-sky-900">{t('completedReviews')}</h1>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder={t('searchStudent')}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <select
          value={classFilter}
          onChange={(e) => { setClassFilter(e.target.value); setPage(1) }}
          className="rounded-full border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="All">{t('allClasses')}</option>
          {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-sky-800/60 text-sm py-16 text-center">{t('loadingStudents')}</p>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <button type="button" onClick={reloadStudents} className="text-sm font-semibold text-sky-600 hover:underline">
            {t('retry')}
          </button>
        </div>
      ) : pageItems.length === 0 ? (
        <div className="text-center py-20 text-sky-700/50">
          <p className="font-heading font-bold">{t('noStudentsMatch')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {pageItems.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5"
            >
              <div className="flex items-start gap-3">
                <Avatar seed={s.avatarSeed} name={s.name} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-heading font-bold text-sky-900 truncate">{s.name}</p>
                    <Badge type="Completed">{t('completed')}</Badge>
                  </div>
                  <p className="text-xs text-sky-700/60">{s.class} &middot; {t('rollNo')} {s.rollNo}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <ReviewIcon reviewKey={s.review} />
                    <span className={`font-heading font-bold ${reviewColor[s.review] || 'text-sky-800'}`}>
                      {reviewLabel(s.review)}
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

      {!loading && !error && completed.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-9 h-9 rounded-full bg-white border border-sky-200 flex items-center justify-center disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-sky-800/70">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-9 h-9 rounded-full bg-white border border-sky-200 flex items-center justify-center disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
