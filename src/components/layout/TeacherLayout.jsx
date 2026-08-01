import { Outlet, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { LogOut, GraduationCap } from 'lucide-react'
import LanguageToggle from '../ui/LanguageToggle'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { Star as StarDoodle, Balloon, ABCBlock } from '../illustrations/Doodles'

export default function TeacherLayout() {
  const { logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    function onUnauthorized() {
      navigate('/login', { replace: true })
    }
    window.addEventListener('ng:unauthorized', onUnauthorized)
    return () => window.removeEventListener('ng:unauthorized', onUnauthorized)
  }, [navigate])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-leaf-50">
      <div className="absolute inset-0 bg-grid-dots -z-20" />
      <div className="absolute top-52 -left-24 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl -z-20" />
      <div className="absolute top-[36rem] -right-24 w-80 h-80 bg-leaf-200/30 rounded-full blur-3xl -z-20" />
      <div className="absolute top-[70rem] left-1/4 w-64 h-64 bg-sunny-200/25 rounded-full blur-3xl -z-20 hidden lg:block" />
      <StarDoodle className="w-6 h-6 top-44 left-6 hidden md:block" color="#FFBE22" delay={0.2} />
      <Balloon className="w-9 h-16 top-72 right-8 hidden lg:block" color="#FF7539" delay={0.6} />
      <ABCBlock className="w-9 h-9 top-[28rem] left-10 hidden lg:block" letter="C" color="#22A3F5" delay={0.9} />
      <StarDoodle className="w-5 h-5 top-[38rem] right-16 hidden md:block" color="#22B566" delay={1.2} />
      <ABCBlock className="w-7 h-7 top-[54rem] right-8 hidden lg:block" letter="G" color="#FA5411" />
      <StarDoodle className="w-6 h-6 top-[62rem] left-16 hidden lg:block" color="#FF7539" />
      <Balloon className="w-8 h-14 top-[66rem] right-24 hidden xl:block" color="#22B566" />

      <div className="relative overflow-hidden bg-white border-b border-sky-100 shadow-soft">
        <div className="absolute inset-0 bg-grid-dots -z-10" />
        <div className="absolute -top-10 right-24 w-32 h-32 bg-leaf-200/40 rounded-full blur-2xl -z-10" />
        <div className="absolute -bottom-8 left-10 w-24 h-24 bg-sunny-200/40 rounded-full blur-2xl -z-10" />
        <StarDoodle className="w-5 h-5 top-3 right-1/3 hidden xl:block" color="#FFBE22" delay={0.4} />
        <ABCBlock className="w-7 h-7 bottom-2 right-1/4 hidden xl:block" letter="T" color="#FA5411" delay={0.9} />

        <header className="relative px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link to="/teacher" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-soft shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <p className="font-heading font-extrabold text-sky-900 leading-tight truncate">{t('welcomeBack')}</p>
          </Link>
          <div className="relative flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <button
              type="button"
              onClick={handleLogout}
              title={t('logout')}
              className="w-10 h-10 rounded-full bg-tangerine-50 text-tangerine-600 hover:bg-tangerine-100 flex items-center justify-center shadow-soft transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>
      </div>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
