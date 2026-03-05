import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MetricGauge from './MetricGauge'
import ProjectDistribution from './ProjectDistribution'
import ProjectTotals from './ProjectTotals'
import MetricPaper from './MetricPaper'

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
    <Box className='flex flex-center' flexWrap='wrap' gap={8}>
      <MetricGauge value={averageCompletedOnTime} title={t('averageCompletedOnTime')} />

      <ProjectTotals />

      <MetricPaper>
        <Typography className='text-center' color='primary' fontWeight={600}>
          {t('metrics.distributionPerStatus')}
        </Typography>
        <ProjectDistribution />
      </MetricPaper>
    </Box>
  )
}
