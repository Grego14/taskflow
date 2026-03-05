/**
 * Determines the time metric field (today, yesterday, thisWeek, thisMonth)
 * to which a given date belongs.
 *
 * @param {Date} targetDate - The date object to check.
 * @returns {string|null} The name of the field (e.g., 'today'), or null if it falls outside the current year.
 */
export default function getMetricPeriod(targetDate) {
  const now = new Date()

  if (!targetDate) return null

  // Normalize to midnight for day comparisons
  const currentYear = now.getFullYear()
  const today = new Date(currentYear, now.getMonth(), now.getDate())
  const targetDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  )

  // If the target date is not in the current year, return null immediately
  if (targetDate.getFullYear() !== currentYear) return null

  if (targetDay.getTime() === today.getTime()) return 'today'

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (targetDay.getTime() === yesterday.getTime()) return 'yesterday'

  const dayOfWeekAdjusted = (today.getDay() + 6) % 7

  const startOfThisWeek = new Date(today)
  startOfThisWeek.setDate(today.getDate() - dayOfWeekAdjusted)

  const startOfLastWeek = new Date(startOfThisWeek)
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7)

  const endOfLastWeek = new Date(startOfThisWeek)
  endOfLastWeek.setDate(startOfThisWeek.getDate() - 1)

  const endOfThisWeek = new Date(startOfThisWeek)
  endOfThisWeek.setDate(startOfThisWeek.getDate() + 6)

  if (targetDay >= startOfThisWeek && targetDay <= endOfThisWeek)
    return 'thisWeek'

  if (targetDay >= startOfLastWeek && targetDay <= endOfLastWeek)
    return 'lastWeek'

  const startOfMonth = new Date(currentYear, now.getMonth(), 1)
  const endOfMonth = new Date(currentYear, now.getMonth() + 1, 0)

  if (targetDay >= startOfMonth && targetDay <= endOfMonth) return 'thisMonth'

  return null
}
