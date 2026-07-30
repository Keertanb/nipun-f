import { motion } from 'framer-motion'

function Cloud({ className = '', delay = 0, scale = 1 }) {
  return (
    <motion.svg
      viewBox="0 0 120 60"
      className={`absolute ${className}`}
      style={{ width: 100 * scale, height: 50 * scale }}
      initial={{ x: '-10%' }}
      animate={{ x: '10%' }}
      transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay }}
    >
      <ellipse cx="35" cy="38" rx="30" ry="18" fill="white" opacity="0.9" />
      <ellipse cx="65" cy="30" rx="26" ry="22" fill="white" opacity="0.9" />
      <ellipse cx="90" cy="40" rx="22" ry="15" fill="white" opacity="0.9" />
      <ellipse cx="50" cy="45" rx="35" ry="14" fill="white" opacity="0.9" />
    </motion.svg>
  )
}

function Bird({ className = '', delay = 0 }) {
  return (
    <motion.svg
      viewBox="0 0 40 20"
      className={`absolute w-8 h-4 ${className}`}
      initial={{ x: 0, y: 0 }}
      animate={{ x: [0, 30, 60], y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <motion.path
        d="M2 10 Q10 -2 20 10 Q30 -2 38 10"
        stroke="#125A8C"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        animate={{ d: ['M2 10 Q10 -2 20 10 Q30 -2 38 10', 'M2 10 Q10 6 20 10 Q30 6 38 10', 'M2 10 Q10 -2 20 10 Q30 -2 38 10'] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}

export default function SkyDecor({ className = '', showBirds = true }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Sun */}
      <motion.div
        className="absolute -top-10 right-6 sm:right-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="140" height="140" viewBox="0 0 140 140">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x="68"
              y="6"
              width="4"
              height="18"
              rx="2"
              fill="#FFBE22"
              opacity="0.85"
              transform={`rotate(${i * 30} 70 70)`}
            />
          ))}
          <circle cx="70" cy="70" r="32" fill="#FFD24D" />
          <circle cx="70" cy="70" r="32" fill="url(#sunGrad)" />
          <defs>
            <radialGradient id="sunGrad" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#FFE58A" />
              <stop offset="100%" stopColor="#F9A007" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      <Cloud className="top-8 left-4" delay={0} scale={1.1} />
      <Cloud className="top-24 left-1/3" delay={1.5} scale={0.8} />
      <Cloud className="top-6 right-1/4" delay={0.8} scale={0.9} />
      <Cloud className="top-40 right-10" delay={2.2} scale={0.7} />

      {showBirds && (
        <>
          <Bird className="top-16 left-1/4" delay={0} />
          <Bird className="top-28 left-1/2" delay={1.2} />
          <Bird className="top-12 right-1/3" delay={2.4} />
        </>
      )}
    </div>
  )
}
