/** Canonical class labels used by Nipun Gujarat (Balvatika → Std 5). */
export const CLASS_LIST = ['Balvatika', 'Std 1', 'Std 2', 'Std 3', 'Std 4', 'Std 5']

function classSortIndex(label) {
  if (/bal\s*vatika/i.test(String(label || ''))) return 0
  const exact = CLASS_LIST.indexOf(label)
  return exact === -1 ? CLASS_LIST.length + 1 : exact
}

/** Sort class labels with Balvatika first, then Std 1–5. */
export function sortClasses(classes = []) {
  return [...new Set(classes.filter(Boolean))].sort((a, b) => {
    const diff = classSortIndex(a) - classSortIndex(b)
    if (diff !== 0) return diff
    return String(a).localeCompare(String(b))
  })
}

/** Classes present in the student list, ordered with Balvatika at the top. */
export function classesFromStudents(students = [], preferred = []) {
  const present = new Set([
    ...students.map((s) => s.class).filter(Boolean),
    ...preferred.filter(Boolean),
  ])
  // Only keep classes that actually have students (for filters with students)
  const withStudents = [...present].filter((c) => students.some((s) => s.class === c))
  return sortClasses(withStudents.length ? withStudents : [...present])
}
