import { useEffect, useState } from 'react'
import { MapPin, School as SchoolIcon } from 'lucide-react'
import StudentListing from '../../components/student/StudentListing'
import LocationFilters from '../../components/admin/LocationFilters'
import { fetchSchoolStudents } from '../../api/master'

export default function SchoolStatus() {
  const [filters, setFilters] = useState({
    districtId: '',
    blockId: '',
    clusterId: '',
    schoolId: '',
    schoolName: '',
    districtName: '',
    blockName: '',
    clusterName: '',
  })
  const [schoolMeta, setSchoolMeta] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!filters.schoolId) {
        setStudents([])
        setSchoolMeta(null)
        setError('')
        return
      }
      setLoading(true)
      setError('')
      try {
        const data = await fetchSchoolStudents(filters.schoolId)
        if (cancelled) return
        setStudents(data.students || [])
        setSchoolMeta(data.school || null)
      } catch (err) {
        if (cancelled) return
        setStudents([])
        setSchoolMeta(null)
        setError(err.message || 'Failed to load school students')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [filters.schoolId])

  const displayName = schoolMeta?.schoolName || filters.schoolName || filters.schoolId
  const completedCount = students.filter((s) => s.status === 'Completed').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-sky-900">School Status</h1>
        <p className="text-sky-800/60 text-sm mt-1">
          Select district, block, cluster and school to view students
        </p>
      </div>

      <div className="bg-white rounded-xl3 shadow-card border border-sky-100 p-4 sm:p-6">
        <LocationFilters value={filters} onChange={setFilters} requireSchool />
      </div>

      {!filters.schoolId && (
        <div className="bg-white rounded-xl3 shadow-card border border-dashed border-sky-200 py-16 px-6 text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <p className="font-heading font-bold text-sky-900">Choose a school to continue</p>
          <p className="text-sky-800/50 text-sm mt-1">
            Students and review details will appear after you pick a school
          </p>
        </div>
      )}

      {filters.schoolId && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-sky-500 to-leaf-500 rounded-xl3 shadow-soft p-5 text-white flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <SchoolIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-heading font-extrabold text-lg leading-snug">{displayName}</p>
              <p className="text-white/80 text-sm mt-1">
                {[schoolMeta?.village, filters.districtName || schoolMeta?.district]
                  .filter(Boolean)
                  .join(' · ') || filters.schoolId}
              </p>
              <p className="text-white/70 text-xs mt-1">
                {loading
                  ? 'Loading students…'
                  : `${students.length} students · ${completedCount} reviewed`}
              </p>
            </div>
          </div>

          {error ? (
            <div className="bg-white rounded-xl3 border border-red-100 p-6 text-sm text-red-600">{error}</div>
          ) : loading ? (
            <div className="bg-white rounded-xl3 border border-sky-100 p-10 text-center text-sky-700/60 text-sm">
              Loading students from registry…
            </div>
          ) : (
            <StudentListing
              students={students}
              basePath={`/admin/school-status/${filters.schoolId}/students`}
            />
          )}
        </div>
      )}
    </div>
  )
}
