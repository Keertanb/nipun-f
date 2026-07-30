const palettes = [
  ['#FFE58A', '#F9A007'], ['#B8E6FF', '#1084D1'], ['#AEF1C8', '#169153'],
  ['#FFC4A6', '#EB3A07'], ['#D9F1FF', '#22A3F5'], ['#FFF3C4', '#DD7A04'],
]

function hashStr(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export default function Avatar({ seed = 'x', name = '', size = 44, className = '' }) {
  const idx = hashStr(seed) % palettes.length
  const [bg, fg] = palettes[idx]
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div
      className={`flex items-center justify-center rounded-full font-heading font-bold shrink-0 ${className}`}
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  )
}
