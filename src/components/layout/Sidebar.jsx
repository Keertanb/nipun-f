import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, X } from 'lucide-react'
import { Star as StarDoodle, Balloon } from '../illustrations/Doodles'

export default function Sidebar({ items, open, onClose, footer }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-sky-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-full w-72 shrink-0 bg-white border border-sky-100 lg:rounded-r-[2rem] lg:shadow-soft flex flex-col overflow-hidden transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="absolute inset-0 bg-grid-dots opacity-60 -z-10" />
        <div className="absolute -top-10 -right-14 w-40 h-40 bg-sunny-100 rounded-full blur-2xl -z-10" />
        <div className="absolute bottom-16 -left-10 w-32 h-32 bg-leaf-100 rounded-full blur-2xl -z-10" />

        <div className="relative flex items-center justify-between px-6 py-5 border-b border-sky-100">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-soft"
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <p className="font-heading font-extrabold text-sky-900 leading-none">Nipun Gujarat</p>
              <p className="text-[11px] text-sky-700/60">Student Review Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-sky-500">
            <X className="w-6 h-6" />
          </button>
          <StarDoodle className="w-4 h-4 top-2 right-8 hidden lg:block" color="#FFBE22" delay={0.3} />
        </div>

        <nav className="relative flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 pl-2.5 pr-4 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-soft'
                    : 'text-sky-800/70 hover:bg-sky-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? 'bg-white/20' : 'bg-sky-50 group-hover:bg-sky-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {footer && (
          <div className="relative px-4 py-5 border-t border-sky-100">
            <Balloon className="w-6 h-11 -top-14 right-6 hidden lg:block opacity-80" color="#FF7539" delay={0.5} />
            {footer}
          </div>
        )}
      </aside>
    </>
  )
}
