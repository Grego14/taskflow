import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CreateTask from './buttons/createTask'

import { useTranslation } from 'react-i18next'

export default function NoTodayTasks() {
  const { t } = useTranslation('tasks')

  return (
    <Box className='flex flex-column flex-center' maxWidth='mobile' mx='auto'>
      <Typography
        className='text-center text-balance'
        mb={2}
        color='textSecondary'
        variant='body2'>
        {t('noTodayTasks')}
      </Typography>
      <CreateTask />
    </Box>
  )
}
