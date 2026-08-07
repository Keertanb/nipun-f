import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ReviewProvider } from './context/ReviewContext'
import { LanguageProvider } from './context/LanguageContext'

import Landing from './pages/Landing'
import Login from './pages/Login'

import TeacherLayout from './components/layout/TeacherLayout'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherStudents from './pages/teacher/TeacherStudents'
import StudentDetail from './pages/teacher/StudentDetail'
import CompletedReviews from './pages/teacher/CompletedReviews'
import TeacherProfile from './pages/teacher/TeacherProfile'

import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import SchoolStatus from './pages/admin/SchoolStatus'
import AdminStudentDetail from './pages/admin/AdminStudentDetail'
import AdminStudents from './pages/admin/AdminStudents'
import ReviewRounds from './pages/admin/ReviewRounds'
import Verifiers from './pages/admin/Verifiers'

function homeForRole(role) {
  if (role === 'teacher') return '/teacher'
  if (role === 'admin') return '/admin'
  return '/'
}

/** Public pages (landing / login). Logged-in users are sent to their home. */
function GuestOnly({ children }) {
  const { user } = useAuth()
  if (user?.role) return <Navigate to={homeForRole(user.role)} replace />
  return children
}

/** Role-gated app areas. Unauthenticated / wrong role → login. */
function RequireRole({ role, children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (user.role !== role) {
    return <Navigate to={homeForRole(user.role)} replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GuestOnly>
            <Landing />
          </GuestOnly>
        }
      />
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />

      <Route
        path="/teacher"
        element={
          <RequireRole role="teacher">
            <TeacherLayout />
          </RequireRole>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="students/:studentId" element={<StudentDetail />} />
        <Route path="completed" element={<CompletedReviews />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireRole role="admin">
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="school-status" element={<SchoolStatus />} />
        <Route path="school-status/:schoolId/students/:studentId" element={<AdminStudentDetail />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="review-rounds" element={<ReviewRounds />} />
        <Route path="verifiers" element={<Verifiers />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ReviewProvider>
          <AppRoutes />
        </ReviewProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
