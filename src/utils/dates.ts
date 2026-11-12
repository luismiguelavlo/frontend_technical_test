/** API timestamps are UTC `Y-m-d H:i:s` (CodeIgniter appTimezone = UTC). */
export function parseApiDate(value: string | null): Date | null {
  if (!value) return null
  const date = new Date(`${value.replace(' ', 'T')}Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

const dateTimeFmt = new Intl.DateTimeFormat('es', { dateStyle: 'long', timeStyle: 'short' })
const relativeFmt = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

/** "12 de noviembre de 2026, 14:53" in the browser's time zone. */
export function formatDateTime(date: Date): string {
  return dateTimeFmt.format(date)
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
]

/** "hace 2 horas", "ayer"… relative to `now`. */
export function formatRelative(date: Date, now: Date = new Date()): string {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000)
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relativeFmt.format(Math.round(seconds / size), unit)
  }
  return 'hace un momento'
}
