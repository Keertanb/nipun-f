import { motion } from 'framer-motion'

// Flat, chunky "kids app" style buttons — solid colour with a thick
// bottom border that shrinks on press, instead of glossy gradients.
const variants = {
  primary: 'bg-sky-500 text-white border-sky-700 hover:bg-sky-400',
  sunny: 'bg-sunny-400 text-tangerine-900 border-tangerine-500 hover:bg-sunny-300',
  green: 'bg-leaf-500 text-white border-leaf-700 hover:bg-leaf-400',
  outline: 'bg-white text-sky-700 border-sky-200 hover:border-sky-400 hover:bg-sky-50',
  ghost: 'bg-transparent text-sky-700 border-transparent hover:bg-sky-50',
  danger: 'bg-bad text-white border-red-700 hover:bg-red-500',
}

const sizes = {
  sm: 'px-4 py-2 text-sm border-b-[3px]',
  md: 'px-6 py-3 text-base border-b-4',
  lg: 'px-8 py-4 text-lg border-b-4',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97, y: 1 }}
      className={`inline-flex items-center justify-center gap-2 font-heading font-bold rounded-full border-2 border-t-2 transition-colors duration-150 active:brightness-95 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  )
}
