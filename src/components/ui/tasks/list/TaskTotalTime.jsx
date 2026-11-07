import AppTooltip from '@components/reusable/AppTooltip'
import TimeIcon from '@mui/icons-material/AccessTime'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useMemo } from 'preact/hooks'
import { useTranslation } from 'react-i18next'

import { taskRegistry } from '@stores/task'
import formatTimer from '@utils/formatTimer'

export default function TaskTotalTime({ id }) {
  const { t } = useTranslation('tasks')

  const registry = taskRegistry.peek()
  const taskData = registry.get(id)?.value || {}
  const { timeWorked = 0, subtasks = [] } = taskData

  const totalSeconds = useMemo(() => {
    const parentTime = timeWorked
    const subtasksTime = subtasks.reduce((acc, sub) => {
      const subtaskSignal = registry.get(sub).peek()
      return acc + (subtaskSignal?.timeWorked || 0)
    }, 0)

    return parentTime + subtasksTime
  }, [timeWorked, subtasks, registry])

  if (!taskData || totalSeconds === 0) return null

  return (
    <AppTooltip title={t('totalAccumulatedTime')}>
      <Stack
        direction='row'
        alignItems='center'
        spacing={0.5}
        className='task-total-time-container'>
        <TimeIcon style={{ fontSize: 14 }} />
        <Typography variant='caption' fontWeight={500}>
          {formatTimer(totalSeconds)}
        </Typography>
      </Stack>
    </AppTooltip>
  )
}
