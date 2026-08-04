import { apiRequest } from './client'
import { mapRegistryStudent } from './teacher'

/** Normalize CTS / master named entities to { id, name }. */
function normalizeNamedList(list) {
  if (!Array.isArray(list)) return []
  return list
    .map((item) => ({
      id: String(item?.id ?? item?.value ?? item?.blockId ?? item?.clusterId ?? item?.districtId ?? ''),
      name: String(item?.name ?? item?.label ?? item?.blockName ?? item?.clusterName ?? item?.districtName ?? ''),
    }))
    .filter((item) => item.id && item.name)
}

export async function fetchDistricts() {
  const res = await apiRequest('/master/districts', { auth: false })
  return normalizeNamedList(res.data)
}

export async function fetchBlocks(districtId) {
  if (!districtId) return []
  const res = await apiRequest(`/master/blocks-by-districtId?districtId=${encodeURIComponent(districtId)}`, {
    auth: false,
  })
  return normalizeNamedList(res.data)
}

/** Clusters for a block — GET /master/clusters-by-blockId?blockId= */
export async function fetchClusters(blockId) {
  if (!blockId) return []
  const res = await apiRequest(`/master/clusters-by-blockId?blockId=${encodeURIComponent(blockId)}`, {
    auth: false,
  })
  return normalizeNamedList(res.data)
}

export async function fetchSchools({ blockId, clusterId } = {}) {
  if (!blockId) return []
  const params = new URLSearchParams({ blockId: String(blockId) })
  if (clusterId) params.set('clusterId', String(clusterId))
  const res = await apiRequest(`/master/schools?${params.toString()}`, { auth: false })
  const list = Array.isArray(res.data) ? res.data : []
  return list
    .map((item) => ({
      id: String(item?.id ?? item?.schoolId ?? item?.value ?? ''),
      name: String(item?.name ?? item?.schoolName ?? item?.label ?? ''),
      blockId: item?.blockId != null ? String(item.blockId) : null,
      clusterId: item?.clusterId != null ? String(item.clusterId) : null,
    }))
    .filter((item) => item.id && item.name)
}

export async function fetchSchoolDetails(schoolId) {
  const res = await apiRequest(`/master/schools/${encodeURIComponent(schoolId)}`, { auth: false })
  return res.data
}

export async function fetchSchoolStudents(schoolId) {
  const res = await apiRequest(`/master/schools/${encodeURIComponent(schoolId)}/students`, { auth: false })
  const payload = res.data || {}
  const school = payload.school || {}
  const meta = {
    schoolId: school.schoolId || schoolId,
    schoolName: school.schoolName || '',
    district: school.district || '',
    block: school.block || '',
    cluster: school.cluster || '',
  }
  return {
    school: meta,
    students: (payload.students || []).map((s) => mapRegistryStudent(s, meta)),
    matrix: payload.matrix || null,
    totals: payload.totals || null,
  }
}
