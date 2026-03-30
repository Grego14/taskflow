import { PieChart } from '@mui/x-charts/PieChart'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useRef } from 'preact/hooks'
import useProjectMetrics from '@hooks/useProjectMetrics'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import useApp from '@hooks/useApp'

import useCounterAnimation from '@hooks/animations/useCounterAnimation'

const getDistributionData = (metrics, theme, t) => {
  const {
    pendingTasks = 0,
    overdueTasks = 0,
    completedTasks = { total: 0 },
    cancelledTasks = { total: 0 }
  } = metrics

  const data = [
    {
      id: 'done',
      value: completedTasks.total,
      label: t('labels.done', { count: completedTasks.total }),
      color: theme.palette.success.main
    },
    {
      id: 'pending',
      value: pendingTasks,
      label: t('labels.pending', { count: pendingTasks }),
      color: theme.palette.info.main
    },
    {
      id: 'overdue',
      value: overdueTasks,
      label: t('labels.overdue', { count: overdueTasks }),
      color: theme.palette.error.main
    },
    {
      id: 'cancelled',
      value: cancelledTasks.total,
      label: t('labels.cancelled', { count: cancelledTasks.total }),
      color: theme.palette.warning.main
    }
  ].filter(item => item.value > 0)

  const total = data.reduce((acc, item) => acc + item.value, 0)

  return { data, total }
}

export default function ProjectDistribution() {
  const { isOnlyMobile } = useApp()
  const theme = useTheme()
  const { t } = useTranslation('metrics')
  const { projectMetrics } = useProjectMetrics()

  const ref = useRef(null)
  const { data, total } = getDistributionData(projectMetrics, theme, t)

  const displayTotal = useCounterAnimation(total, { trigger: ref })

  return (
    <Box
      ref={ref}
      className='relative'
      display='inline-block'
      width='100%'>
      <PieChart
        series={[
          {
            data,
            innerRadius: 75,
            outerRadius: 100,
            paddingAngle: 3,
            cornerRadius: 10,
            cx: isOnlyMobile ? '50%' : 140,
            highlightScope: { fade: 'global', highlight: 'item' }
          }
        ]}
        height={300}
        slotProps={{
          legend: {
            direction: 'vertical',
            position: { vertical: 'middle', horizontal: 'center' },
            hidden: isOnlyMobile,
            sx: {
              fontSize: { xs: 14, tablet: 16 },
              fill: theme.palette.text.secondary,
              '& .MuiChartsLegend-item+.MuiChartsLegend-item': {
                mt: 1
              }
            }
          }
        }}
        margin={{
          right: isOnlyMobile ? 0 : 150,
          top: 20,
          bottom: 20
        }}
        sx={{
          '& .MuiChartsLegend-root': {
            display: { xs: 'none', tablet: 'block' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: isOnlyMobile ? '50%' : '140px',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
        <Typography variant='h4' fontWeight={800} sx={{ lineHeight: 1 }}>
          {displayTotal}
        </Typography>
        <Typography
          variant='caption'
          color='textSecondary'
          sx={{
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
          {t('total')}
        </Typography>
      </Box>
    </Box>
  )
}
