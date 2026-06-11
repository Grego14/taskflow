import { PieChart } from '@mui/x-charts/PieChart'
import Typography from '@mui/material/Typography'

import { useRef } from 'preact/hooks'
import useProjectMetrics from '@hooks/useProjectMetrics'
import { useTranslation } from 'react-i18next'
import useApp from '@hooks/useApp'

import useCounterAnimation from '@hooks/animations/useCounterAnimation'

const getDistributionData = (metrics, t) => {
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
      color: 'var(--mui-palette-success-main)'
    },
    {
      id: 'pending',
      value: pendingTasks,
      label: t('labels.pending', { count: pendingTasks }),
      color: 'var(--mui-palette-info-main)'
    },
    {
      id: 'overdue',
      value: overdueTasks,
      label: t('labels.overdue', { count: overdueTasks }),
      color: 'var(--mui-palette-error-light)'
    },
    {
      id: 'cancelled',
      value: cancelledTasks.total,
      label: t('labels.cancelled', { count: cancelledTasks.total }),
      color: 'var(--mui-palette-warning-main)'
    }
  ].filter(item => item.value > 0)

  const total = data.reduce((acc, item) => acc + item.value, 0)
  return { data, total }
}

export default function ProjectDistribution() {
  const { isOnlyMobile } = useApp()
  const { t } = useTranslation('metrics')
  const { projectMetrics } = useProjectMetrics()

  const ref = useRef(null)
  const { data, total } = getDistributionData(projectMetrics, t)

  const displayTotal = useCounterAnimation(total, { trigger: ref })
  const distributionStyle = { '--chart-cx': isOnlyMobile ? '50%' : '140px' }

  return (
      <div 
      ref={ref} 
      className='pie-chart-container relative' 
      style={distributionStyle}>
      <PieChart
        series={[{
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
            hidden: isOnlyMobile
          }
        }}
        margin={{
          right: isOnlyMobile ? 0 : 150,
          top: 20,
          bottom: 20
        }}
        className='distribution-pie-chart'
      />
      <div className='pie-chart-center-label absolute text-center'>
        <Typography 
          variant='h4' 
          fontWeight={800} 
          className='pie-chart-total-text'>
          {displayTotal}
        </Typography>
        <Typography
          variant='caption'
          color='textSecondary'
          className='pie-chart-caption-text'>
          {t('total')}
        </Typography>
      </div>
    </div>
  )
}
