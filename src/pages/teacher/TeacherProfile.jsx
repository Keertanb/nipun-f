import { useEffect, useState } from 'react'
import { School, MapPin, Hash, Users2, Phone, UserRound } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import { useAuth } from '../../context/AuthContext'

export default function TeacherProfile() {
  const { user, refreshTeacherProfile } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const teacher = user?.teacher
  const school = user?.school

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (user?.role !== 'teacher') return
      setRefreshing(true)
      setError('')
      try {
        await refreshTeacherProfile()
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to refresh profile')
      } finally {
        if (!cancelled) setRefreshing(false)
      }
    }
    load()
    return () => { cancelled = true }
    // refresh once on mount
  }, [])

  if (!teacher) return null

  const rows = [
    { icon: Hash, label: 'Teacher ID', value: teacher.teacherId },
    { icon: UserRound, label: 'Designation', value: teacher.designation || 'Teacher' },
    { icon: School, label: 'School Name', value: teacher.schoolName || school?.school },
    { icon: Hash, label: 'School Code', value: teacher.schoolCode || school?.udise || school?.schoolid },
    { icon: MapPin, label: 'District', value: teacher.district || school?.district },
    { icon: MapPin, label: 'Block', value: teacher.block || school?.block },
    { icon: MapPin, label: 'Cluster', value: teacher.cluster || school?.cluster },
    { icon: MapPin, label: 'Village', value: teacher.village || school?.village },
    { icon: Users2, label: 'Classes Assigned', value: (teacher.classesAssigned || []).join(', ') || '—' },
    { icon: Phone, label: 'Principal Mobile', value: school?.mobileprincipal || '—' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-leaf-600 rounded-xl3 shadow-soft p-8 text-white text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <Avatar seed={teacher.avatarSeed} name={teacher.name} size={96} className="mx-auto ring-4 ring-white/40 text-2xl" />
        <h1 className="font-heading font-extrabold text-2xl mt-4">{teacher.name}</h1>
        <p className="text-sky-50/80 text-sm">{teacher.designation || 'Government Teacher'}</p>
        {refreshing ? <p className="text-sky-50/70 text-xs mt-2">Refreshing from registry…</p> : null}
      </div>

      {error ? <p className="text-sm text-red-600 text-center">{error}</p> : null}

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 divide-y divide-sky-50">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-4 px-6 py-4">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <r.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-sky-700/50">{r.label}</p>
              <p className="font-semibold text-sky-900 text-sm">{r.value || '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
