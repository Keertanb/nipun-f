export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl3 shadow-card border border-sky-100 ${
        hover ? 'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
