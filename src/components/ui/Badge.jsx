const styles = {
  Completed: 'bg-good/15 text-good border border-good/30',
  Pending: 'bg-avg/15 text-avg border border-avg/30',
  Good: 'bg-good/15 text-good border border-good/30',
  Average: 'bg-avg/15 text-avg border border-avg/30',
  Bad: 'bg-bad/15 text-bad border border-bad/30',
  Active: 'bg-good/15 text-good border border-good/30',
  Inactive: 'bg-gray-200 text-gray-500 border border-gray-300',
  neutral: 'bg-sky-50 text-sky-700 border border-sky-200',
}

export default function Badge({ children, type = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
        styles[type] || styles.neutral
      } ${className}`}
    >
      {children}
    </span>
  )
}
