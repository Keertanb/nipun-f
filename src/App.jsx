import { Routes, Route, Navigate } from 'react-router-dom'
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
import AdminSchools from './pages/admin/AdminSchools'
import SchoolManagement from './pages/admin/SchoolManagement'
import AdminTeachers from './pages/admin/AdminTeachers'
import TeacherReviews from './pages/admin/TeacherReviews'
import AdminStudents from './pages/admin/AdminStudents'
import AdminCompletedReviews from './pages/admin/AdminCompletedReviews'
import Verifiers from './pages/admin/Verifiers'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'

function RequireRole({ role, children }) {
  const { user } = useAuth()
  if (!user || user.role !== role) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

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
        <Route path="schools" element={<AdminSchools />} />
        <Route path="school-tree" element={<SchoolManagement />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="teachers/:teacherId/reviews" element={<TeacherReviews />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="completed" element={<AdminCompletedReviews />} />
        <Route path="verifiers" element={<Verifiers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
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
