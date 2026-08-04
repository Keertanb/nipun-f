import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, School, Users, ShieldCheck, CalendarRange, LogOut, Menu,
} from 'lucide-react'
import Sidebar from './Sidebar'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'
import { Star as StarDoodle, Balloon, ABCBlock } from '../illustrations/Doodles'

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/school-status', label: 'School Status', icon: School },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/review-rounds', label: 'Review Rounds', icon: CalendarRange },
  { to: '/admin/verifiers', label: 'Verifiers', icon: ShieldCheck },
]

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="h-screen overflow-hidden flex gap-3 py-3 pr-3 bg-gradient-to-br from-sky-50 via-white to-leaf-50">
      <Sidebar
        items={items}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm text-tangerine-600 hover:bg-tangerine-50 transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        }
      />
      <div className="relative flex-1 min-w-0 flex flex-col bg-white border border-sky-100 rounded-none lg:rounded-[2rem] shadow-soft overflow-hidden">
        <div className="absolute inset-0 bg-grid-dots -z-10" />
        <header className="relative shrink-0 overflow-hidden bg-gradient-to-r from-sky-50 to-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-sky-100">
          <div className="absolute -top-8 right-24 w-28 h-28 bg-sunny-200/40 rounded-full blur-2xl -z-10" />
          <StarDoodle className="w-5 h-5 top-2 right-40 hidden xl:block" color="#FFBE22" delay={0.4} />
          <ABCBlock className="w-7 h-7 -bottom-1 right-56 hidden xl:block" letter="G" color="#22B566" delay={0.9} />
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden text-sky-600">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-soft">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-sky-700/60">Government of Gujarat</p>
                <p className="font-heading font-extrabold text-sky-900 leading-tight">Admin Control Center</p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center gap-3">
            <Balloon className="w-6 h-11 top-1 right-16 hidden md:block" color="#22A3F5" delay={0.7} />
            <Avatar seed={user?.username || 'admin'} name="Admin" size={40} className="ring-2 ring-white shadow-soft" />
            <span className="absolute -bottom-0.5 right-2.5 w-2.5 h-2.5 rounded-full bg-leaf-500 border-2 border-white" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
