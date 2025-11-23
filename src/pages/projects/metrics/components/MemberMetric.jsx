import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { MetricColumn, MetricGauge, MetricPaper } from './MetricUtils'

import { useTranslation } from 'react-i18next'

export default function MemberMetric({ data, metric }) {
  const { t } = useTranslation('metrics')

  if (typeof metric !== 'object' || !metric?.assignedTasks) return null

  // fallback to 1 to prevent dividing 0/0
  const averageCompletedOnTime =
    (metric.assignedTasks.completedOnTime / (metric.assignedTasks.total || 1)) *
    100

  return (
    <MetricPaper>
      <Box className='flex' gap={2}>
        <Avatar src={data.avatar} />
        <Box>
          <Typography>{data.username}</Typography>
          <Typography color='textSecondary' variant='body2'>
            {data.email}
          </Typography>
        </Box>
      </Box>

      <Paper
        className='flex flex-column flex-center'
        sx={{ p: 2 }}
        elevation={4}>
        <Typography
          color='primary'
          fontWeight='bold'
          className='text-center text-balance'>
          {t('averageCompletedOnTime')}
        </Typography>
        <MetricGauge
          value={
            averageCompletedOnTime > 0
              ? averageCompletedOnTime.toFixed(1)
              : averageCompletedOnTime
          }
          size={150}
          fontSize={30}
        />
      </Paper>
      <Box
        className='flex'
        justifyContent='space-between'
        gap={2}
        flexWrap='wrap'>
        <MetricColumn
          text={t('assignedTasks')}
          value={metric.assignedTasks.total}
        />
        <MetricColumn
          text={t('completedTasks')}
          value={metric.assignedTasks.completed}
        />
        <MetricColumn
          text={t('completedOnTimeTasks')}
          value={metric.assignedTasks.completedOnTime}
        />
        <MetricColumn
          text={t('cancelledTasks')}
          value={metric.assignedTasks.cancelled}
        />
        <MetricColumn
          text={t('overdueTasks')}
          value={metric.assignedTasks.overdue}
        />
      </Box>
    </MetricPaper>
  )
}
