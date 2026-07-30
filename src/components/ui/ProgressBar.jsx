import { motion } from 'framer-motion'

export default function ProgressBar({ pct = 0, color = 'sky', label }) {
  const colorMap = {
    sky: 'from-sky-400 to-sky-600',
    green: 'from-leaf-400 to-leaf-600',
    sunny: 'from-sunny-400 to-tangerine-500',
  }
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs font-semibold text-sky-800/70 mb-1">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="w-full h-2.5 rounded-full bg-sky-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]}`}
        />
      </div>
    </div>
  )
}
