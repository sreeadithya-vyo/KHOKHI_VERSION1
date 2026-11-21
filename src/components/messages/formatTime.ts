const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
const DAY = 24 * 60 * 60 * 1000

/** Whole calendar days between `iso` and `now` (0 = today, 1 = yesterday). */
function daysAgo(iso: string, now: Date) {
  return Math.round((startOfDay(now) - startOfDay(new Date(iso))) / DAY)
}

function shortDate(date: Date, now: Date) {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' }),
  })
}

/** "Just now", "12m ago", "2h ago", "Yesterday", or a short date like "12 Nov". */
export function relativeTime(iso: string, now = new Date()) {
  const days = daysAgo(iso, now)
  if (days <= 0) {
    const minutes = Math.floor((now.getTime() - new Date(iso).getTime()) / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }
  if (days === 1) return 'Yesterday'
  return shortDate(new Date(iso), now)
}

/** Label for a day divider in a thread: "Today", "Yesterday" or a short date. */
export function dayLabel(iso: string, now = new Date()) {
  const days = daysAgo(iso, now)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return shortDate(new Date(iso), now)
}

/** Clock time of a message, e.g. "3:42 pm". */
export const clockTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })

/** True when two ISO timestamps fall on the same calendar day. */
export const sameDay = (a: string, b: string) => startOfDay(new Date(a)) === startOfDay(new Date(b))
