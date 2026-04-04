import Button from '@mui/material/Button'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'

import { useTranslation } from 'react-i18next'

import formatTimer from '@utils/formatTimer'
import { priorityColors } from '@/constants'

import { globalClock, activeTaskData, showOverlay } from '@stores/task'

const ZenTimer = () => {
  const { t } = useTranslation('tasks')
  const task = activeTaskData.value

  if (!task) return null

  const elapsed = Math.floor((globalClock.value - task.startTime) / 1000)

  return (
    <span>
      {t('zenMode')} • {formatTimer(task.initialSeconds + elapsed)}
    </span>
  )
}

export default function ZenModeStatus() {
  const task = activeTaskData.value

  if (!task) return null

  const priority = task.priority || 'none'
  const [fgColor] = priorityColors[priority]

  return (
    <Button
      variant='outlined'
      size='small'
      onClick={() => (showOverlay.value = true)}
      startIcon={<OpenInFullIcon />}
      sx={theme => ({
        borderColor: fgColor,
        color: fgColor,
        textTransform: 'none',
        borderRadius: 2,
        '&:hover': {
          borderColor: fgColor,
          backgroundColor: theme.alpha(fgColor, 0.08)
        },
        ...theme.typography.body2,
        fontWeight: 600
      })}>
      <ZenTimer />
    </Button>
  )
}
