import { TotalRow } from './MetricUtils.jsx'

// pending tasks
import AccessTimeIcon from '@mui/icons-material/AccessTime'
// cancelled
import CancelIcon from '@mui/icons-material/Cancel'
// icons for the total tasks
//
// completed and completed on time
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
// overdue
import ErrorIcon from '@mui/icons-material/Error'

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
    <>
      <TotalRow
        text={t('projectMetrics.totalCompleted')}
        total={completedTasks.total}
        icon={<CheckCircleOutlineIcon color='success' fontSize='small' />}
      />
      <TotalRow
        text={t('projectMetrics.totalCompletedOnTime')}
        total={completedOnTime.total}
        icon={<CheckCircleOutlineIcon color='secondary' fontSize='small' />}
      />
      <TotalRow
        text={t('projectMetrics.totalCancelled')}
        total={cancelledTasks.total}
        icon={<CancelIcon color='error' fontSize='small' />}
      />
      <TotalRow
        text={t('projectMetrics.totalPending')}
        total={pendingTasks}
        icon={<AccessTimeIcon color='info' fontSize='small' />}
      />
      <TotalRow
        text={t('projectMetrics.totalOverdue')}
        total={overdueTasks}
        icon={<ErrorIcon color='warning' fontSize='small' />}
        isLast
      />
    </>
  )
}
