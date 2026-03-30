import Box from '@mui/material/Box'
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
    <Box className='text-center'>
      <Typography variant='h6' fontWeight={800} color={`${color}.main`}>
        {count}
      </Typography>
      <Typography variant='caption' color='textSecondary' fontWeight={600}>
        {text}
      </Typography>
    </Box>
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

  return (
    <Paper
      ref={cardRef}
      elevation={0}
      sx={{
        p: 3,
        mb: 2,
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: { xs: 1, mobile: 2 },
        transition: 'translate 0.2s ease-in-out, background-color 0.2s ease-in-out',
        '&:hover': {
          bgcolor: alpha(theme.palette.action.hover, 0.04),
          translate: '0 -5px'
        },
        bgcolor: 'transparent',
        maxWidth: '30rem',
        mx: 'auto',
        px: 4
      }}>
      <Box className='flex flex-center'
        sx={{
          gap: 2,
          minWidth: { xs: 200, mobile: '100%' },
          flex: { tablet: 1 },
          justifyContent: 'start'
        }}>
        <Avatar
          src={member?.avatar}
          sx={{
            width: 56,
            height: 56,
            border: `2px solid ${theme.palette.primary.main}`
          }}>
          {member?.username?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant='subtitle1' fontWeight={700}>
            {member?.username}
          </Typography>
          <Typography variant='caption' color='textSecondary'>
            {t(isOwner ? 'ownerLabel' : 'memberLabel')}
          </Typography>
        </Box>
      </Box>

      <Box className='flex flex-center' gap={3} sx={{ flex: 2 }}>
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
      </Box>

      <Box sx={{
        minWidth: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        mx: 'auto'
      }}>
        <MetricGauge
          value={efficiency}
          size={100}
          title={t('completedOnTimeTasks')}
        />
      </Box>
    </Paper>
  )
}
