import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock } from 'lucide-react'

export default function StudentCard({ student, basePath = '/teacher/students' }) {
  const navigate = useNavigate()
  const isCompleted = student.status === 'Completed'

  return (
    <motion.button
      onClick={() => navigate(`${basePath}/${student.id}`)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={`relative w-full text-left bg-white rounded-3xl border-2 shadow-card p-5 pt-4 overflow-hidden transition-colors ${
        isCompleted ? 'border-leaf-100 hover:border-leaf-300' : 'border-sunny-200 hover:border-tangerine-300'
      }`}
    >
      <span
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isCompleted ? 'bg-gradient-to-r from-leaf-400 to-leaf-600' : 'bg-gradient-to-r from-sunny-400 to-tangerine-500'
        }`}
      />
      <div className="flex items-start justify-between gap-2 mt-1.5">
        <div className="min-w-0">
          <p className="font-heading font-bold text-sky-900 truncate">{student.name}</p>
          <p className="text-xs text-sky-700/60 mt-1">
            Roll #{student.rollNo} &middot; {student.gender}{student.age != null ? ` · Age ${student.age}` : ''}
          </p>
        </div>
        <span
          className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold ${
            isCompleted ? 'bg-good/15 text-good' : 'bg-avg/15 text-avg'
          }`}
        >
          {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {student.status}
        </span>
      </div>
    </motion.button>
  )
}
