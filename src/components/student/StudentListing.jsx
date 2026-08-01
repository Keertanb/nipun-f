import { useMemo, useState } from 'react'
import { Search, BookOpen } from 'lucide-react'
import Accordion from '../ui/Accordion'
import StudentCard from './StudentCard'
import { CLASS_LIST, classesFromStudents } from '../../constants/classes'
import { useLanguage } from '../../context/LanguageContext'

const groupColors = ['sky', 'leaf', 'sunny']

export default function StudentListing({ students, basePath = '/teacher/students', classesAssigned = [] }) {
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const statusTabs = [
    { key: 'All', label: t('allStudents'), active: 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-soft' },
    { key: 'Pending', label: t('pending'), active: 'bg-gradient-to-r from-sunny-400 to-tangerine-500 text-white shadow-soft' },
    { key: 'Completed', label: t('completed'), active: 'bg-gradient-to-r from-leaf-500 to-leaf-600 text-white shadow-soft' },
  ]

  const availableClasses = useMemo(
    () => classesFromStudents(students, classesAssigned),
    [students, classesAssigned],
  )

  const filterClasses = availableClasses.length ? availableClasses : CLASS_LIST

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase())
      const matchesClass = classFilter === 'All' || s.class === classFilter
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter
      return matchesSearch && matchesClass && matchesStatus
    })
  }, [students, search, classFilter, statusFilter])

  const grouped = useMemo(() => {
    const known = filterClasses
      .map((cls) => ({ cls, list: filtered.filter((s) => s.class === cls) }))
      .filter((g) => g.list.length > 0)
    const knownSet = new Set(known.map((g) => g.cls))
    const extra = [...new Set(filtered.map((s) => s.class).filter((c) => c && !knownSet.has(c)))]
      .map((cls) => ({ cls, list: filtered.filter((s) => s.class === cls) }))
    return [...known, ...extra].sort((a, b) => {
      const order = CLASS_LIST
      const ai = /bal\s*vatika/i.test(a.cls) ? 0 : order.indexOf(a.cls)
      const bi = /bal\s*vatika/i.test(b.cls) ? 0 : order.indexOf(b.cls)
      const aIdx = ai === -1 ? order.length + 1 : ai
      const bIdx = bi === -1 ? order.length + 1 : bi
      return aIdx - bIdx || a.cls.localeCompare(b.cls)
    })
  }, [filtered, filterClasses])

  return (
    <div className="space-y-4">
      <div className="relative bg-white rounded-xl3 shadow-card border border-sky-100 p-4 flex flex-col sm:flex-row gap-3 overflow-hidden">
        <div className="absolute inset-0 bg-grid-dots -z-10" />
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchStudent')}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="w-full sm:w-auto rounded-full border border-sky-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="All">{t('allClasses')}</option>
          {filterClasses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-full font-heading font-semibold text-sm whitespace-nowrap transition-all shrink-0 ${
              statusFilter === tab.key ? tab.active : 'bg-white border border-sky-200 text-sky-800/70 hover:bg-sky-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {grouped.length === 0 && (
        <div className="text-center py-16 text-sky-700/50">
          <p className="font-heading font-bold">{t('noStudentsMatch')}</p>
        </div>
      )}
      {grouped.map(({ cls, list }, i) => {
        const completed = list.filter((s) => s.status === 'Completed').length
        const pending = list.filter((s) => s.status === 'Pending').length
        const badgeLabel =
          statusFilter === 'Pending'
            ? t('pendingCount', { n: pending, total: list.length })
            : statusFilter === 'Completed'
              ? t('completedCount', { n: list.length })
              : t('completedOfTotal', { n: completed, total: list.length })

        return (
          <Accordion
            key={cls}
            title={cls}
            subtitle={`${list.length} ${t('students')}`}
            icon={BookOpen}
            color={groupColors[i % groupColors.length]}
            badge={
              <span className="text-xs font-semibold text-sky-700/60 hidden sm:inline">
                {badgeLabel}
              </span>
            }
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((s) => (
                <StudentCard key={s.id} student={s} basePath={basePath} />
              ))}
            </div>
          </Accordion>
        )
      })}
    </div>
  )
}
