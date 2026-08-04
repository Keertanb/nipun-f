import { apiRequest } from './client'

export async function fetchRounds(academicYear) {
  const qs = academicYear ? `?academicYear=${encodeURIComponent(academicYear)}` : ''
  const res = await apiRequest(`/rounds${qs}`, { auth: false })
  return res.data || { rounds: [] }
}

export async function fetchActiveRound(academicYear) {
  const qs = academicYear ? `?academicYear=${encodeURIComponent(academicYear)}` : ''
  const res = await apiRequest(`/rounds/active${qs}`, { auth: false })
  return res.data || { round: null, canSubmit: false }
}

export async function createRound({ startDate, endDate, name, academicYear, roundNumber }) {
  const res = await apiRequest('/rounds', {
    auth: false,
    method: 'POST',
    body: {
      startDate,
      endDate,
      ...(name ? { name } : {}),
      ...(academicYear ? { academicYear } : {}),
      ...(roundNumber ? { roundNumber } : {}),
    },
  })
  return res.data
}

export async function updateRound(roundId, { startDate, endDate, name }) {
  const res = await apiRequest(`/rounds/${encodeURIComponent(roundId)}`, {
    auth: false,
    method: 'PATCH',
    body: {
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
      ...(name != null ? { name } : {}),
    },
  })
  return res.data
}
