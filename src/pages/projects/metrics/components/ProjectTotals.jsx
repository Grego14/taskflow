import StatCard from './StatCard'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ErrorIcon from '@mui/icons-material/Error'
import TimerIcon from '@mui/icons-material/Timer'
import Box from '@mui/material/Box'

import useProjectMetrics from '@hooks/useProjectMetrics'
import { useTranslation } from 'react-i18next'

export default function ProjectTotals() {
  const { t } = useTranslation('metrics')
  const { projectMetrics } = useProjectMetrics()
  const {
    completedTasks,
    completedOnTime,
    cancelledTasks,
    pendingTasks,
    overdueTasks
  } = projectMetrics

  return (
    <div className='flex flex-wrap project-totals-container'>
      <StatCard
        label={t('metrics.completed')}
        total={completedTasks.total}
        icon={<CheckCircleIcon />}
        color='success'
      />
      <StatCard
        label={t('metrics.completedOnTime')}
        total={completedOnTime.total}
        icon={<TimerIcon />}
        color='secondary'
      />
      <StatCard
        label={t('metrics.pending')}
        total={pendingTasks}
        icon={<PendingActionsIcon />}
        color='info'
        pulse
      />
      <StatCard
        label={t('metrics.overdue')}
        total={overdueTasks}
        icon={<ErrorIcon />}
        color='error'
      />
      <StatCard
        label={t('metrics.cancelled')}
        total={cancelledTasks.total}
        icon={<CancelIcon />}
        color='warning'
      />
    </div>
  )
}
