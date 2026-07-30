import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const themes = {
  sky: { icon: 'bg-sky-100 text-sky-600', header: 'bg-sky-50/60 hover:bg-sky-50', border: 'border-sky-200' },
  leaf: { icon: 'bg-leaf-100 text-leaf-600', header: 'bg-leaf-50/60 hover:bg-leaf-50', border: 'border-leaf-200' },
  sunny: { icon: 'bg-sunny-100 text-tangerine-600', header: 'bg-sunny-50/60 hover:bg-sunny-50', border: 'border-sunny-200' },
}

export default function Accordion({ title, subtitle, icon: Icon, badge, defaultOpen = false, color = 'sky', children }) {
  const [open, setOpen] = useState(defaultOpen)
  const theme = themes[color] || themes.sky
  return (
    <div className={`bg-white rounded-xl3 shadow-card border-2 overflow-hidden ${theme.border}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-4 px-5 py-4 transition-colors ${theme.header}`}
      >
        <div className="flex items-center gap-3 text-left">
          {Icon && (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${theme.icon}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <p className="font-heading font-bold text-sky-900">{title}</p>
            {subtitle && <p className="text-xs text-sky-700/60">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {badge}
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="w-5 h-5 text-sky-500" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
