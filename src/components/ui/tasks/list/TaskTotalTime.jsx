import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import TimeIcon from '@mui/icons-material/AccessTime'
import TaskTooltip from '@components/reusable/tasks/Tooltip'

import { useMemo } from 'preact/hooks'
import { useTranslation } from 'react-i18next'

import formatTimer from '@utils/formatTimer'
import { taskRegistry } from '@stores/task'

export default function TaskTotalTime({ id }) {
  const { t } = useTranslation('tasks')

  const taskData = taskRegistry.peek().get(id)?.value || {}
  const { timeWorked = 0, subtasks = [] } = taskData

  const totalSeconds = useMemo(() => {
    const parentTime = timeWorked
    const subtasksTime =
      subtasks.reduce((acc, sub) => acc + (sub?.timeWorked || 0), 0)

    return parentTime + subtasksTime
  }, [timeWorked, subtasks])

  if(!taskData || totalSeconds === 0) return null

  return (
    <TaskTooltip title={t('totalAccumulatedTime')}>
      <Stack
        direction='row'
        alignItems='center'
        spacing={0.5}
        sx={{ color: 'text.secondary', opacity: 0.8, mr: 0.5 }}>
        <TimeIcon sx={{ fontSize: 12 }} />
        <Typography variant='caption' fontWeight={500}>
          {formatTimer(totalSeconds)}
        </Typography>
      </Stack>
    </TaskTooltip>
  )
}
