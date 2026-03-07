import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import formatTimestamp from '@utils/formatTimestamp'

const ONE_DAY_MS = 86400000

const days =
  [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ]

export default function SmartDateLabel({ date, sx = {} }) {
  const { t } = useTranslation('ui')

  const targetDate = date?.seconds ?
    formatTimestamp(date).raw
    // the dueDate can be an ISOString 
    : new Date(date)

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const compareDate = new Date(targetDate)
  compareDate.setHours(0, 0, 0, 0)

  const diffInMs = compareDate.getTime() - now.getTime()
  const diffInDays = Math.round(diffInMs / ONE_DAY_MS)

  let dateKey = ''
  let isOverdue = false
  let isToday = false

  let label = ''

  if (diffInDays < 0) {
    label = t('dates.overdue')
    isOverdue = true
  } else if (diffInDays === 0) {
    label = t('dates.today')
    isToday = true
  } else if (diffInDays === 1) {
    label = t('dates.tomorrow')
  } else if (diffInDays < 7) {
    label = t(`dates.${days[compareDate.getDay()]}`)
  } else {
    label = targetDate.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <Typography
      variant='caption'
      sx={{
        fontWeight: (isOverdue || isToday) ? 600 : 400,
        color: isOverdue
          ? 'error.main'
          : isToday
            ? 'primary.main'
            : 'text.secondary',
        display: 'inline-flex',
        alignItems: 'center',
        ...sx
      }}>
      {label}
    </Typography>
  )
}
