import Button from '@mui/material/Button'
import PlayIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import AppTooltip from '@components/reusable/AppTooltip'

import { useTranslation } from 'react-i18next'
import useTasks from '@hooks/useTasks'
import { useTheme } from '@mui/material/styles'

import formatTimer from '@utils/formatTimer'
import { playSound, stopSound } from '@services/audio'
import getDueDateLabel from '@utils/tasks/getDueDateLabel'

import { 
  activeTaskData, 
  isAlarmRinging, 
  currentSessionSeconds,
  taskRegistry
} from '@stores/task'
import { useCallback, useMemo } from 'preact/hooks'

import '@styles/components/buttons/smartActionLabel.css'

const LiveTimer = () => {
  if (!activeTaskData.value) return null
  return <span>{formatTimer(currentSessionSeconds.value)}</span>
}

export default function SmartActionLabel({ id, insideTask }) {
  const { t } = useTranslation(['ui', 'tasks'])
  const { toggleWorkingTask } = useTasks()

  const taskData = taskRegistry.peek().get(id)?.value

  if (!taskData) return null

  const isThisTaskWorking = activeTaskData.value?.id === id
  const { label, isOverdue, isToday } = getDueDateLabel(taskData.dueDate)

  const handleToggle = useCallback((e) => {
    e.stopPropagation()

    if (isAlarmRinging.value) {
      isAlarmRinging.value = false
      stopSound('endSessionGoal')
    }

    const currentActive = activeTaskData.value
    const willStart = !currentActive || currentActive.id !== id

    playSound(willStart ? 'startSession' : 'endSession')

    // if working on this task pass nul to stop it, otherwise send the data
    toggleWorkingTask(willStart ? taskData : null)
  }, [id])

  const dynamicStyles = useMemo(() => {
    const hasDate = !!taskData.dueDate
    const canPlayDirectly = isToday || isThisTaskWorking

    const colorVar = isOverdue 
      ? 'var(--mui-palette-error-main)' 
      : isToday 
        ? 'var(--mui-palette-primary-main)' 
        : 'var(--mui-palette-text-secondary)'

    const finalColor = hasDate || isThisTaskWorking 
      ? colorVar 
      : 'var(--mui-palette-text-secondary)'

    return {
      '--btn-color': finalColor,
      '--bg-hover': `color-mix(in srgb, ${finalColor}, transparent 85%)`,
      '--btn-size': !insideTask ? '40px' : '36px',
      '--font-weight': (isOverdue || isToday) ? 600 : 400,
      '--play-opacity': canPlayDirectly || !hasDate ? 0.6 : 0
    }
  }, [isOverdue, isToday, taskData.dueDate, isThisTaskWorking, insideTask])

  const hasDate = !!taskData.dueDate

  return (
    <AppTooltip
      title={isThisTaskWorking ? t('tasks:pauseTask') : t('tasks:workOnTask')}>
      <Button 
        onClick={handleToggle} 
        style={dynamicStyles} 
        className='smart-action-btn'>
        {isThisTaskWorking ? (
          <PauseIcon className='smart-action-icon' />
        ) : (
          <PlayIcon className='smart-action-icon' />)}

        {isThisTaskWorking ? <LiveTimer /> : (hasDate ? label : null)}
      </Button>
    </AppTooltip>
  )
}
