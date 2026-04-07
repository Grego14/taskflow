import Button from '@mui/material/Button'
import PlayIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import TaskTooltip from '@components/reusable/tasks/Tooltip'

import { useTranslation } from 'react-i18next'
import useTasks from '@hooks/useTasks'
import { useTheme } from '@mui/material/styles'

import formatTimestamp from '@utils/formatTimestamp'
import formatTimer from '@utils/formatTimer'
import { playSound, stopSound } from '@services/audio'
import getDueDateLabel from '@utils/tasks/getDueDateLabel'

import { 
  activeTaskData, 
  isAlarmRinging, 
  currentSessionSeconds
} from '@stores/task'

const LiveTimer = () => {
  const task = activeTaskData.value

  if (!task) return null

  return <span>{formatTimer(currentSessionSeconds.value)}</span>
}

export default function SmartActionLabel({ data, insideTask }) {
  const { t } = useTranslation(['ui', 'tasks'])
  const { toggleWorkingTask } = useTasks()
  const theme = useTheme()

  const isThisTaskWorking = activeTaskData.value?.id === data.id
  const { label, isOverdue, isToday } = getDueDateLabel(data?.dueDate)

  const handleToggle = (e) => {
    if(isAlarmRinging.value) {
      isAlarmRinging.value = false
      stopSound('endSessionGoal')
    }

    const endingSession = activeTaskData.value

    playSound(!endingSession ? 'startSession' : 'endSession')
    toggleWorkingTask(!endingSession ? data : null)
  }

  const canPlayDirectly = isToday || isThisTaskWorking
  const hasDate = !!data?.dueDate

  const btnColor = (isOverdue || isToday) && hasDate
    ? theme.palette[isOverdue ? 'error' : 'primary'].main
    : theme.palette.text.secondary

  const btnSize = !insideTask ? '40px' : '36px'

  return (
    <TaskTooltip
      title={isThisTaskWorking ? t('tasks:pauseTask') : t('tasks:workOnTask')}>
      <Button
        onClick={handleToggle}
        sx={theme => ({
          color: btnColor,
          display: 'inline-flex',
          alignItems: 'center',
          alignSelf: 'center',
          gap: 0.5,
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { backgroundColor: theme.alpha(btnColor, 0.15) },
          ...theme.typography.caption,
          fontWeight: (isOverdue || isToday) ? 600 : 400,
          '&:hover .play-icon': { opacity: 1 },
          fontVariantNumeric: 'tabular-nums',
          minWidth: btnSize,
          minHeight: btnSize
        })}>
        {isThisTaskWorking ? (
          <PauseIcon sx={{ fontSize: 12 }} />
        ) : (
          <PlayIcon
            className='play-icon'
            sx={{
              fontSize: 12,
              transition: 'opacity 0.2s ease',
              opacity: canPlayDirectly || !hasDate ? 0.6 : 0,
              '&:hover': { opacity: 1 }
            }}
          />
        )}

        {isThisTaskWorking ? <LiveTimer /> : (hasDate ? label : null)}
      </Button>
    </TaskTooltip>
  )
}
