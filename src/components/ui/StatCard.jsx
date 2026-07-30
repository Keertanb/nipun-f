import { motion } from 'framer-motion'

const themes = {
  sky: 'from-sky-400 to-sky-600',
  green: 'from-leaf-400 to-leaf-600',
  sunny: 'from-sunny-400 to-tangerine-500',
  purple: 'from-fuchsia-400 to-purple-500',
}

export default function StatCard({ icon: Icon, label, value, theme = 'sky', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl3 shadow-card border border-sky-100 p-5 flex items-center gap-4"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${themes[theme]} flex items-center justify-center shadow-soft shrink-0`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <p className="text-2xl font-heading font-extrabold text-sky-900 leading-none">{value}</p>
        <p className="text-sm text-sky-700/60 font-medium mt-1">{label}</p>
      </div>
    </motion.div>
  )
}
