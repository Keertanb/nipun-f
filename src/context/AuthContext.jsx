import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { loginTeacher, logoutTeacher, fetchTeacherProfile } from '../api/teacher'
import { getSession, clearSession } from '../api/client'
import env from '../helpers/env'
import { getSsoDetails, getUserConsent, isSsoExpired, setSsoDetails } from '../helpers/swiftChatSso'

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

  async function loginAsTeacher({ teacherCode, mobile }) {
    setLoading(true)
    setError(null)
    try {
      let ssoDetails = getSsoDetails()
      if (env.swiftChatSDKEnabled) {
        if (isSsoExpired(ssoDetails)) {
          ssoDetails = await getUserConsent()
        }
      } else if (!ssoDetails?.grant_token) {
        ssoDetails = await getUserConsent()
        if (ssoDetails?.grant_token) setSsoDetails(ssoDetails)
      }

      const { teacher, school } = await loginTeacher({
        teacherCode,
        mobile,
        ssoDetails: ssoDetails || {},
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
