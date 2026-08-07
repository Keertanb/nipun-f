import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { loginTeacher, logoutTeacher, fetchTeacherProfile } from '../api/teacher'
import { getSession, clearSession } from '../api/client'
import env from '../helpers/env'
import { getSsoDetails, getUserConsent, setSsoDetails } from '../helpers/swiftChatSso'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ng_user')
    const session = getSession()
    if (!saved || !session?.sessionToken) {
      localStorage.removeItem('ng_user')
      clearSession()
      return null
    }
    try {
      return JSON.parse(saved)
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const persistUser = useCallback((u) => {
    setUser(u)
    if (u) localStorage.setItem('ng_user', JSON.stringify(u))
    else localStorage.removeItem('ng_user')
  }, [])

  const updateTeacherMeta = useCallback((partial) => {
    setUser((prev) => {
      if (!prev?.teacher) return prev
      const next = { ...prev, teacher: { ...prev.teacher, ...partial } }
      localStorage.setItem('ng_user', JSON.stringify(next))
      return next
    })
  }, [])

  useEffect(() => {
    function onUnauthorized() {
      setUser(null)
      localStorage.removeItem('ng_user')
      localStorage.removeItem('ng_students')
    }
    window.addEventListener('ng:unauthorized', onUnauthorized)
    return () => window.removeEventListener('ng:unauthorized', onUnauthorized)
  }, [])

  /**
   * Survey-style SSO:
   * - If SDK/mocks available → getUserConsent when expired, then send ssoDetails
   * - Always send grant_token so backend can resolve user_id (mobile) and persist it
   */
  async function loginAsTeacher({ teacherCode }) {
    setLoading(true)
    setError(null)
    try {
      const hasMiniApp =
        typeof window !== 'undefined' && Boolean(window.MiniAppExtension?.getUserConsent)

      let ssoDetails = {}

      // Real SwiftChat webview OR local mocks both expose MiniAppExtension
      if (env.swiftChatSDKEnabled || hasMiniApp) {
        ssoDetails = getSsoDetails()
        if (!ssoDetails.expires_at || Date.now() >= Number(ssoDetails.expires_at) * 1000) {
          const payload = await getUserConsent()
          if (!payload?.grant_token) {
            throw new Error('SwiftChat SSO consent is required to sign in')
          }
          ssoDetails = setSsoDetails(payload)
        }
        if (!ssoDetails?.grant_token) {
          throw new Error('SwiftChat SSO grant_token is required to sign in')
        }
      }

      const { teacher, school } = await loginTeacher({
        teacherCode,
        ssoDetails,
      })
      const u = { role: 'teacher', teacher, school }
      persistUser(u)
      return u
    } catch (err) {
      setError(err.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  function loginAsAdmin(username, password) {
    const ADMIN_ID = 'ad2400'
    const ADMIN_PASSWORD = 'Admin@2026'
    const id = String(username || '').trim()
    const pass = String(password || '')

    if (id !== ADMIN_ID || pass !== ADMIN_PASSWORD) {
      const err = new Error('Invalid admin ID or password')
      setError(err.message)
      throw err
    }

    const u = { role: 'admin', username: ADMIN_ID }
    persistUser(u)
    setError(null)
    return u
  }

  async function logout() {
    if (user?.role === 'teacher') {
      await logoutTeacher()
    } else {
      clearSession()
    }
    persistUser(null)
    localStorage.removeItem('ng_students')
  }

  async function refreshTeacherProfile() {
    if (user?.role !== 'teacher') return null
    const { teacher, school } = await fetchTeacherProfile()
    const u = {
      ...user,
      teacher: {
        ...teacher,
        classesAssigned: user.teacher?.classesAssigned || teacher.classesAssigned || [],
      },
      school,
    }
    persistUser(u)
    return u
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        loginAsTeacher,
        loginAsAdmin,
        logout,
        refreshTeacherProfile,
        updateTeacherMeta,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
