/**
 * Determines the time metric field (today, yesterday, thisWeek, thisMonth, thisQuarterly, thisYear)
 * to which a given date belongs, using fixed quadmesters (4-month quarters).
 *
 * Fixed Quadmesters: Q1 (Jan-Apr), Q2 (May-Aug), Q3 (Sep-Dec).
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

  // (Fixed Quadmesters: Jan-Apr, May-Aug, Sep-Dec)
  const currentMonth = now.getMonth()

  // Determine the current quadmester index (0, 1, or 2) by dividing month index by 4
  const quarterIndex = Math.floor(currentMonth / 4)

  const startQuarterMonth = quarterIndex * 4 // 0, 4, or 8 (Jan, May, Sep)
  const endQuarterMonth = startQuarterMonth + 3 // 3, 7, or 11 (Apr, Aug, Dec)

  const startOfQuarter = new Date(currentYear, startQuarterMonth, 1)
  // The end of the quadmester is the last day of the 'endQuarterMonth'
  const endOfQuarter = new Date(currentYear, endQuarterMonth + 1, 0)

  if (targetDay >= startOfQuarter && targetDay <= endOfQuarter)
    return 'thisQuarterly'

  // If the date is not captured by any specific period (Day, Week, Month, Quadmester)
  // but we know it's within the current year (checked at the start), it belongs to thisYear.
  const startOfYear = new Date(currentYear, 0, 1) // January 1st
  const endOfYear = new Date(currentYear, 11, 31) // December 31st

  if (targetDay >= startOfYear && targetDay <= endOfYear) return 'thisYear'

  return null
}
