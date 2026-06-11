import Button from '@mui/material/Button'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'

import { useTranslation } from 'react-i18next'
import { useMemo } from 'preact/hooks'

import formatTimer from '@utils/formatTimer'
import { priorityColors } from '@/constants'

import { 
  currentSessionSeconds, 
  activeTaskData, 
  showOverlay
} from '@stores/task'

const ZenTimer = () => {
  const { t } = useTranslation('tasks')
  const task = activeTaskData.value

  if (!task) return null

  return (
    <span className='zen-timer-text'>
      {t('zenMode')} • {formatTimer(currentSessionSeconds.value)}
    </span>
  )
}

export default function ZenModeStatus() {
  const task = activeTaskData.value

  if (!task) return null

  const dynamicStyles = useMemo(() => {
    const priority = task.priority || 'none'
    const [fgColor, bgColor] = priorityColors[priority]

    return { 
      '--fg-priority': fgColor,
      '--bg-priority': bgColor
    }
  }, [task?.priority])

  return (
    <Button
      variant='outlined'
      size='small'
      onClick={() => (showOverlay.value = true)}
      startIcon={<OpenInFullIcon />}
      className='zen-status-btn'
      style={dynamicStyles}>
      <ZenTimer />
    </Button>
  )
}
