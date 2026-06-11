import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import MetricGauge from './MetricGauge'

import { useRef } from 'preact/compat'
import { alpha, useTheme } from '@mui/material/styles'
import useCounterAnimation from '@hooks/animations/useCounterAnimation'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'

const MetricRow = ({ count, text, color }) => {
  return (
    <div className='text-center'>
      <Typography variant='h6' fontWeight={800} color={`${color}.main`}>
        {count}
      </Typography>
      <Typography variant='caption' color='textSecondary' fontWeight={600}>
        {text}
      </Typography>
    </div>
  )
}

export default function MemberStatCard({ member, metrics }) {
  const { t } = useTranslation('metrics')
  const { data } = useProject()
  const theme = useTheme()
  const cardRef = useRef(null)

  const { completedTasks, assignedTasks, completedOnTime } = metrics

  const efficiency = completedTasks.total > 0
    ? (completedOnTime.total / completedTasks.total) * 100
    : 0

  const animatedCompleted = useCounterAnimation(completedTasks.total, { trigger: cardRef })
  const animatedPending = useCounterAnimation(assignedTasks.pending, { trigger: cardRef })
  const animatedOverdue = useCounterAnimation(assignedTasks.overdue, { trigger: cardRef })

  const isOwner = member?.id === data?.createdBy

  if(!member) return null

  return (
    <Paper
      ref={cardRef}
      elevation={0}
      className='member-stat-card flex flex-wrap'>
      <div className='flex flex-center member-info-wrapper'>
        <Avatar src={member?.avatar} className='member-avatar'>
          {member?.username?.charAt(0)}
        </Avatar>
        <div>
          <Typography variant='subtitle1' fontWeight={700}>
            {member?.username}
          </Typography>
          <Typography variant='caption' color='textSecondary'>
            {t(isOwner ? 'ownerLabel' : 'memberLabel')}
          </Typography>
        </div>
      </div>

      <div className='flex flex-center member-metrics-row'>
        <MetricRow
          count={animatedCompleted}
          text={t('metrics.completed')}
          color='success' />
        <MetricRow
          count={animatedPending}
          text={t('metrics.pending')}
          color='info' />
        <MetricRow
          count={animatedOverdue}
          text={t('metrics.overdue')}
          color='error' />
      </div>

      <div className='gauge-container-wrapper flex'>
        <MetricGauge
          value={efficiency}
          size={100}
          title={t('completedOnTimeTasks')}
        />
      </div>
    </Paper>
  )
}
