import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, className = '' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-sky-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className={`relative bg-white rounded-xl3 shadow-soft w-full max-w-lg max-h-[90vh] overflow-y-auto ${className}`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-sky-100 sticky top-0 bg-white rounded-t-xl3">
              <h3 className="font-heading font-bold text-lg text-sky-900">{title}</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-sky-50 flex items-center justify-center text-sky-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
