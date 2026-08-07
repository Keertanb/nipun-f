import { apiRequest } from './client'

export async function fetchRoundStages(roundId) {
  const res = await apiRequest(`/rounds/${encodeURIComponent(roundId)}/stages`, { auth: false })
  return res.data || { stages: [] }
}

export async function createRoundStage(roundId, body) {
  const res = await apiRequest(`/rounds/${encodeURIComponent(roundId)}/stages`, {
    auth: false,
    method: 'POST',
    body,
  })
  return res.data
}

export async function updateRoundStage(roundId, stageId, body) {
  const res = await apiRequest(
    `/rounds/${encodeURIComponent(roundId)}/stages/${encodeURIComponent(stageId)}`,
    { auth: false, method: 'PATCH', body },
  )
  return res.data
}

export async function deleteRoundStage(roundId, stageId) {
  const res = await apiRequest(
    `/rounds/${encodeURIComponent(roundId)}/stages/${encodeURIComponent(stageId)}`,
    { auth: false, method: 'DELETE' },
  )
  return res.data
}

export async function fetchStageQuestions(roundId, stageId) {
  const res = await apiRequest(
    `/rounds/${encodeURIComponent(roundId)}/stages/${encodeURIComponent(stageId)}/questions`,
    { auth: false },
  )
  return res.data || { questions: [] }
}

export async function createStageQuestion(roundId, stageId, body) {
  const res = await apiRequest(
    `/rounds/${encodeURIComponent(roundId)}/stages/${encodeURIComponent(stageId)}/questions`,
    { auth: false, method: 'POST', body },
  )
  return res.data
}

export async function deleteStageQuestion(roundId, stageId, questionId) {
  const res = await apiRequest(
    `/rounds/${encodeURIComponent(roundId)}/stages/${encodeURIComponent(stageId)}/questions/${encodeURIComponent(questionId)}`,
    { auth: false, method: 'DELETE' },
  )
  return res.data
}

export async function fetchTeacherStageProgress(roundId) {
  const res = await apiRequest(
    `/rounds/${encodeURIComponent(roundId)}/stages/teacher-progress`,
    { auth: false },
  )
  return res.data || { teachers: [], stages: [] }
}

export async function fetchTeacherStageWorkspace() {
  const res = await apiRequest('/teacher/stage-workspace')
  return res.data || {}
}

export async function completeTeacherStage(stageId) {
  const res = await apiRequest(`/teacher/stages/${encodeURIComponent(stageId)}/complete`, {
    method: 'POST',
  })
  return res.data
}

export async function addTeacherStageQuestion(stageId, body) {
  const res = await apiRequest(`/teacher/stages/${encodeURIComponent(stageId)}/questions`, {
    method: 'POST',
    body,
  })
  return res.data
}

export async function saveTeacherIntervention(stageId, body) {
  const res = await apiRequest(`/teacher/stages/${encodeURIComponent(stageId)}/interventions`, {
    method: 'PUT',
    body,
  })
  return res.data
}
