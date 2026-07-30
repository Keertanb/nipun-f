/** Canonical class labels used by Nipun Gujarat (Balvatika → Std 5). */
export const CLASS_LIST = ['Balvatika', 'Std 1', 'Std 2', 'Std 3', 'Std 4', 'Std 5']

/** Classes present in the student list, ordered like CLASS_LIST (then any extras). */
export function classesFromStudents(students = [], preferred = []) {
  const present = new Set(students.map((s) => s.class).filter(Boolean))
  const preferredOrder = preferred.length ? preferred : CLASS_LIST
  const ordered = preferredOrder.filter((c) => present.has(c))
  for (const c of CLASS_LIST) {
    if (present.has(c) && !ordered.includes(c)) ordered.push(c)
  }
  for (const c of present) {
    if (!ordered.includes(c)) ordered.push(c)
  }
  return ordered
}
