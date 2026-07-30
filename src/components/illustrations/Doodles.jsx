import { motion } from 'framer-motion'

// A handful of small, hand-drawn-feeling decorations (stars, balloons,
// crayons, a rainbow, an alphabet block) used to scatter a playful,
// "kids' classroom" feeling across the landing page sections. These are
// static (no bounce/float animation) so they read as background texture
// rather than moving elements competing for attention.

// A cute, simple waving child character — used as a friendly doodle to
// bring a "kids' classroom" feeling to otherwise plain page margins.
export function Kid({ className = '', color = '#22A3F5', hair = '#3A2A22', skin = '#FFDCB8' }) {
  return (
    <svg viewBox="0 0 60 96" className={`absolute ${className}`}>
      {/* legs */}
      <rect x="20" y="70" width="8" height="20" rx="4" fill="#144D74" />
      <rect x="32" y="70" width="8" height="20" rx="4" fill="#144D74" />
      {/* body */}
      <rect x="17" y="38" width="26" height="36" rx="12" fill={color} />
      {/* far arm */}
      <rect x="9" y="44" width="8" height="22" rx="4" fill={color} transform="rotate(-18 9 44)" />
      {/* head */}
      <circle cx="30" cy="21" r="16" fill={skin} />
      <path d="M13 19 Q30 0 47 19 L47 14 Q30 4 13 14 Z" fill={hair} />
      {/* smile */}
      <path d="M23 25 Q30 30 37 25" stroke="#94440D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="23" cy="19" r="1.8" fill="#3A2A22" />
      <circle cx="37" cy="19" r="1.8" fill="#3A2A22" />
      <circle cx="18" cy="24" r="4.5" fill="#FF9C6E" opacity="0.55" />
      <circle cx="42" cy="24" r="4.5" fill="#FF9C6E" opacity="0.55" />
      {/* waving arm, held mid-wave */}
      <rect x="41" y="40" width="8" height="24" rx="4" fill={color} transform="rotate(-24 41 42)" />
    </svg>
  )
}

export function Star({ className = '', color = '#FFBE22' }) {
  return (
    <svg viewBox="0 0 40 40" className={`absolute ${className}`}>
      <path
        d="M20 2 L24.5 15 L38 15 L27 23.5 L31 37 L20 28.5 L9 37 L13 23.5 L2 15 L15.5 15 Z"
        fill={color}
      />
    </svg>
  )
}

export function Balloon({ className = '', color = '#FF7539' }) {
  return (
    <svg viewBox="0 0 60 120" className={`absolute ${className}`}>
      <ellipse cx="30" cy="34" rx="28" ry="34" fill={color} />
      <ellipse cx="20" cy="20" rx="8" ry="11" fill="white" opacity="0.35" />
      <path d="M30 68 L24 78 L36 78 Z" fill={color} />
      <path d="M30 80 Q10 100 30 118 Q50 100 30 80" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
    </svg>
  )
}

export function Crayon({ className = '', color = '#22B566' }) {
  return (
    <svg viewBox="0 0 30 100" className={`absolute ${className}`}>
      <path d="M15 2 L26 16 L26 90 Q26 96 15 96 Q4 96 4 90 L4 16 Z" fill={color} />
      <path d="M15 2 L26 16 L4 16 Z" fill="#FFDCB8" />
      <rect x="4" y="60" width="22" height="10" fill="white" opacity="0.5" />
    </svg>
  )
}

export function Rainbow({ className = '' }) {
  const bands = ['#FA5411', '#FFBE22', '#43CD82', '#22A3F5']
  return (
    <svg viewBox="0 0 160 90" className={`absolute ${className}`}>
      {bands.map((c, i) => (
        <path
          key={c}
          d={`M${10 + i * 10} ${85 - i * 2} A${70 - i * 10} ${70 - i * 10} 0 0 1 ${150 - i * 10} ${85 - i * 2}`}
          stroke={c}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

export function ABCBlock({ className = '', letter = 'A', color = '#22A3F5' }) {
  return (
    <svg viewBox="0 0 60 60" className={`absolute ${className}`}>
      <rect x="3" y="3" width="54" height="54" rx="12" fill="white" stroke={color} strokeWidth="4" />
      <text x="30" y="40" textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontSize="28" fontWeight="800" fill={color}>
        {letter}
      </text>
    </svg>
  )
}

// A scatter of tiny confetti dots to break up plain empty space behind
// text blocks — sized/positioned as percentages of the parent.
const CONFETTI_DOTS = [
  { x: '4%', y: '6%', size: 10, color: '#FFBE22' },
  { x: '92%', y: '2%', size: 8, color: '#43CD82' },
  { x: '12%', y: '92%', size: 7, color: '#FF7539' },
  { x: '85%', y: '88%', size: 9, color: '#22A3F5' },
  { x: '55%', y: '4%', size: 6, color: '#FA5411' },
  { x: '70%', y: '48%', size: 6, color: '#22B566' },
  { x: '2%', y: '45%', size: 8, color: '#F9A007' },
]

export function ConfettiDots({ className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none -z-10 ${className}`} aria-hidden="true">
      {CONFETTI_DOTS.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{ left: d.x, top: d.y, width: d.size, height: d.size, backgroundColor: d.color, opacity: 0.8 }}
        />
      ))}
    </div>
  )
}

// A solid-filled geometric shape (circle, square, triangle) in a theme
// colour — simple ambient decoration for wide side margins.
export function SolidShape({ className = '', shape = 'circle', color = '#22A3F5' }) {
  if (shape === 'triangle') {
    return (
      <div
        className={`absolute ${className}`}
        style={{
          width: 0,
          height: 0,
          borderLeft: '18px solid transparent',
          borderRight: '18px solid transparent',
          borderBottom: `30px solid ${color}`,
        }}
      />
    )
  }
  return (
    <div
      className={`absolute ${shape === 'square' ? 'rounded-xl rotate-45' : 'rounded-full'} ${className}`}
      style={{ backgroundColor: color }}
    />
  )
}

// A hand-drawn-style squiggly underline, useful beneath headings for a
// crayon-doodle accent.
export function SquiggleUnderline({ className = '', color = '#FFBE22' }) {
  return (
    <svg viewBox="0 0 200 20" className={className} preserveAspectRatio="none">
      <motion.path
        d="M2 14 Q30 2 55 12 T110 10 T160 13 T198 8"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    </svg>
  )
}
