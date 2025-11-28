import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { MetricGauge, MetricPaper } from './MetricUtils.jsx'
import ProjectDistribution from './ProjectDistribution'
import ProjectTotals from './ProjectTotals'

import useProjectMetrics from '@hooks/useProjectMetrics'
import { useTranslation } from 'react-i18next'

export default function Metrics({ filter }) {
  const { t } = useTranslation('metrics')
  const { projectMetrics } = useProjectMetrics()

  const { completedTasks, completedOnTime } = projectMetrics

  if (!completedTasks || !completedOnTime) return

  // fallback to 1 to prevent dividing 0/0
  const averageCompletedOnTime =
    (completedOnTime.total / (completedTasks.total || 1)) * 100

  return (
    <Box className='flex flex-center' flexWrap='wrap' gap={4}>
      <MetricPaper className='flex-center' title={t('averageCompletedOnTime')}>
        <MetricGauge
          value={
            averageCompletedOnTime > 0
              ? averageCompletedOnTime.toFixed(1)
              : averageCompletedOnTime
          }
        />
      </MetricPaper>

      <MetricPaper className='flex flex-column'>
        <ProjectTotals />
      </MetricPaper>

      <MetricPaper title={t('projectMetrics.distributionPerStatus')}>
        <ProjectDistribution />
      </MetricPaper>
    </Box>
  )
}
