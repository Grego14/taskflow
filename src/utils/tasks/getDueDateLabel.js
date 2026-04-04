import { ONE_DAY_MS } from '@/constants'
import formatTimestamp from '@utils/formatTimestamp'
import i18n from '@/i18n'

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

/**
 * Gets a human-readable label and status for a due date
 * @param {Object|Date|string} dueDate - Firebase Timestamp or Date object/string
 * @returns {Object} { label, isOverdue, isToday, diffInDays }
 */
export default function getDueDateLabel(dueDate) {
  const t = i18n.getFixedT(i18n.language)

  if (!dueDate) return { label: '', isOverdue: false, isToday: false, diffInDays: null }

  const targetDate = dueDate?.seconds
    ? formatTimestamp(dueDate).raw
    : new Date(dueDate)

  // normalize "now" and "target" to midnight for accurate day comparison
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const compareDate = new Date(targetDate)
  compareDate.setHours(0, 0, 0, 0)

  const diffInMs = compareDate.getTime() - now.getTime()
  const diffInDays = Math.round(diffInMs / ONE_DAY_MS)

  const isOverdue = diffInDays < 0
  const isToday = diffInDays === 0
  let label = ''

  if (isOverdue) {
    label = t('ui:dates.overdue')
  } else if (isToday) {
    label = t('ui:dates.today')
  } else if (diffInDays === 1) {
    label = t('ui:dates.tomorrow')
  } else if (diffInDays < 7) {
    label = t(`ui:dates.${days[compareDate.getDay()]}`)
  } else {
    label = targetDate.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short'
    })
  }

  return {
    label,
    isOverdue,
    isToday,
    diffInDays
  }
}
