const API_BASE = import.meta.env.VITE_API_URL || '/api/v1'

const SESSION_KEY = 'ng_session'

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

function emitUnauthorized() {
  clearSession()
  localStorage.removeItem('ng_user')
  window.dispatchEvent(new CustomEvent('ng:unauthorized'))
}

export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  if (auth) {
    const session = getSession()
    if (!session?.sessionToken || !session?.userId) {
      emitUnauthorized()
      const err = new Error('Session expired, please log in again')
      err.status = 401
      throw err
    }
    headers.Authorization = `Bearer ${session.sessionToken}`
    headers.userid = String(session.userId)
    headers.roleid = String(session.roleId ?? 1)
  }

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    })
  } catch {
    const err = new Error('Unable to reach the server. Is the backend running?')
    err.status = 0
    throw err
  }

  let payload = null
  try {
    payload = await res.json()
  } catch {
    payload = null
  }

  if (!res.ok) {
    if (res.status === 401 && auth) emitUnauthorized()
    const err = new Error(payload?.message || `Request failed (${res.status})`)
    err.status = res.status
    err.data = payload?.data
    throw err
  }

  return payload
}
