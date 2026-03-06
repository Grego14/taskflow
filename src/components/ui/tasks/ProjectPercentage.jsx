import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'

export default function ProjectPercentage() {
  const { t } = useTranslation('projects')
  const { appBarHeight, isMobile } = useApp()
  const { metrics } = useProject()
  const { totalTasks, totalCompletedTasks } = metrics

  const actualPercentage =
    totalTasks > 0 ? (totalCompletedTasks / totalTasks) * 100 : 0
  const percentageToComplete = 100 - actualPercentage

  return (
    <Box
      className='flex flex-center'
      gap={2}
      py={3}
      mt='auto'
      flexDirection={isMobile ? 'column' : 'row'}>
      <PercentageText
        text={t('projectPercentageActual')}
        amount={actualPercentage}
        id='actual'
      />
      <PercentageText
        text={t('projectPercentageLeft')}
        amount={percentageToComplete}
        id='remaining'
      />
    </Box>
  )
}

function PercentageText({ text, amount }) {
  return (
    <Typography className='flex flex-center' gap={1}>
      {text}:{' '}
      <Typography
        color='primary'
        fontWeight={600}
        variant='caption'
        sx={[theme => ({ ...theme.typography.h6 })]}>
        {amount.toFixed(1)}%
      </Typography>
    </Typography>
  )
}
