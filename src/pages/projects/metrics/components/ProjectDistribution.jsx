import { PieChart } from '@mui/x-charts/PieChart'

import useApp from '@hooks/useApp'
import useProjectMetrics from '@hooks/useProjectMetrics'
import { useTranslation } from 'react-i18next'

export default function ProjectDistribution() {
  const { isOnlyMobile } = useApp()
  const { t } = useTranslation('metrics')
  const { projectMetrics } = useProjectMetrics()
  const { pendingTasks, overdueTasks, completedTasks, cancelledTasks } =
    projectMetrics

  const data = [
    {
      id: 'done',
      value: completedTasks.total,
      label: t('labels.done', { amount: completedTasks.total })
    },
    {
      id: 'cancelled',
      value: cancelledTasks.total,
      label: t('labels.cancelled', { amount: cancelledTasks.total })
    },
    {
      id: 'pending',
      value: pendingTasks,
      label: t('labels.pending', { amount: pendingTasks })
    },
    {
      id: 'overdue',
      value: overdueTasks,
      label: t('labels.overdue', { amount: overdueTasks })
    }
  ]

  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { fade: 'global', highlight: 'item' }
        }
      ]}
      width={200}
      height={200}
      sx={{
        ...(isOnlyMobile && {
          gridTemplateRows: '1fr 1fr',
          gridTemplateColumns: '1fr',
          gridTemplateAreas: 'unset',
          '& .MuiChartsLegend-root': {
            gridArea: 'unset'
          },
          '& svg': {
            gridArea: 'unset'
          }
        })
      }}
    />
  )
}
