import { useEffect, useState } from 'react'
import { fetchDistricts, fetchBlocks, fetchClusters, fetchSchools } from '../../api/master'

const selectClass =
  'w-full rounded-2xl border border-sky-200 bg-white px-4 py-2.5 text-sm text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-sky-50 disabled:text-sky-700/40'

/**
 * Cascading District → Block → Cluster → School selectors.
 * Cluster options come from GET /master/clusters-by-blockId?blockId=
 */
export default function LocationFilters({
  value,
  onChange,
  districtPlaceholder = 'Select district',
  blockPlaceholder = 'Select block',
  clusterPlaceholder = 'Select cluster',
  schoolPlaceholder = 'Select school',
}) {
  const [districts, setDistricts] = useState([])
  const [blocks, setBlocks] = useState([])
  const [clusters, setClusters] = useState([])
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState({
    districts: false,
    blocks: false,
    clusters: false,
    schools: false,
  })
  const [error, setError] = useState('')

  const districtId = value?.districtId || ''
  const blockId = value?.blockId || ''
  const clusterId = value?.clusterId || ''
  const schoolId = value?.schoolId || ''

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading((s) => ({ ...s, districts: true }))
      setError('')
      try {
        const list = await fetchDistricts()
        if (!cancelled) setDistricts(list)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load districts')
      } finally {
        if (!cancelled) setLoading((s) => ({ ...s, districts: false }))
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!districtId) {
        setBlocks([])
        return
      }
      setLoading((s) => ({ ...s, blocks: true }))
      try {
        const list = await fetchBlocks(districtId)
        if (!cancelled) setBlocks(list)
      } catch (err) {
        if (!cancelled) {
          setBlocks([])
          setError(err.message || 'Failed to load blocks')
        }
      } finally {
        if (!cancelled) setLoading((s) => ({ ...s, blocks: false }))
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [districtId])

  // Load clusters whenever block changes — clusters-by-blockId
  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!blockId) {
        setClusters([])
        return
      }
      setClusters([])
      setLoading((s) => ({ ...s, clusters: true }))
      setError('')
      try {
        const list = await fetchClusters(blockId)
        if (!cancelled) setClusters(list)
      } catch (err) {
        if (!cancelled) {
          setClusters([])
          setError(err.message || 'Failed to load clusters')
        }
      } finally {
        if (!cancelled) setLoading((s) => ({ ...s, clusters: false }))
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [blockId])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!blockId || !clusterId) {
        setSchools([])
        return
      }
      setSchools([])
      setLoading((s) => ({ ...s, schools: true }))
      try {
        const list = await fetchSchools({ blockId, clusterId })
        if (!cancelled) setSchools(list)
      } catch (err) {
        if (!cancelled) {
          setSchools([])
          setError(err.message || 'Failed to load schools')
        }
      } finally {
        if (!cancelled) setLoading((s) => ({ ...s, schools: false }))
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [blockId, clusterId])

  function emit(next) {
    const district = districts.find((d) => String(d.id) === String(next.districtId))
    const block = blocks.find((b) => String(b.id) === String(next.blockId))
    const cluster = clusters.find((c) => String(c.id) === String(next.clusterId))
    const school = schools.find((s) => String(s.id) === String(next.schoolId))
    onChange({
      districtId: next.districtId || '',
      blockId: next.blockId || '',
      clusterId: next.clusterId || '',
      schoolId: next.schoolId || '',
      districtName: district?.name || value?.districtName || '',
      blockName: block?.name || value?.blockName || '',
      clusterName: cluster?.name || '',
      schoolName: school?.name || '',
    })
  }

  function onDistrictChange(id) {
    setError('')
    setBlocks([])
    setClusters([])
    setSchools([])
    emit({ districtId: id, blockId: '', clusterId: '', schoolId: '' })
  }

  function onBlockChange(id) {
    setError('')
    setClusters([])
    setSchools([])
    emit({ districtId, blockId: id, clusterId: '', schoolId: '' })
  }

  function onClusterChange(id) {
    setError('')
    setSchools([])
    const cluster = clusters.find((c) => String(c.id) === String(id))
    onChange({
      districtId,
      blockId,
      clusterId: id,
      schoolId: '',
      districtName: value?.districtName || '',
      blockName: value?.blockName || '',
      clusterName: cluster?.name || '',
      schoolName: '',
    })
  }

  function onSchoolChange(id) {
    setError('')
    const school = schools.find((s) => String(s.id) === String(id))
    onChange({
      districtId,
      blockId,
      clusterId,
      schoolId: id,
      districtName: value?.districtName || '',
      blockName: value?.blockName || '',
      clusterName: value?.clusterName || '',
      schoolName: school?.name || '',
    })
  }

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-sky-700/60 uppercase tracking-wide">District</span>
          <select
            value={districtId}
            onChange={(e) => onDistrictChange(e.target.value)}
            className={selectClass}
            disabled={loading.districts}
          >
            <option value="">{loading.districts ? 'Loading…' : districtPlaceholder}</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-sky-700/60 uppercase tracking-wide">Block</span>
          <select
            value={blockId}
            onChange={(e) => onBlockChange(e.target.value)}
            disabled={!districtId || loading.blocks}
            className={selectClass}
          >
            <option value="">{loading.blocks ? 'Loading…' : blockPlaceholder}</option>
            {blocks.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-sky-700/60 uppercase tracking-wide">Cluster</span>
          <select
            value={clusterId}
            onChange={(e) => onClusterChange(e.target.value)}
            disabled={!blockId || loading.clusters}
            className={selectClass}
          >
            <option value="">
              {!blockId
                ? 'Select block first'
                : loading.clusters
                  ? 'Loading clusters…'
                  : clusters.length
                    ? clusterPlaceholder
                    : 'No clusters found'}
            </option>
            {clusters.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-sky-700/60 uppercase tracking-wide">School</span>
          <select
            value={schoolId}
            onChange={(e) => onSchoolChange(e.target.value)}
            disabled={!clusterId || loading.schools}
            className={selectClass}
          >
            <option value="">
              {!clusterId
                ? 'Select cluster first'
                : loading.schools
                  ? 'Loading schools…'
                  : schools.length
                    ? schoolPlaceholder
                    : 'No schools found'}
            </option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
