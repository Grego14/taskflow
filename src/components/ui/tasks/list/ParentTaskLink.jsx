import LinkIcon from '@mui/icons-material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'
import { taskRegistry } from '@stores/task'

export default function ParentTaskLink({ parentTask }) {
  const { t } = useTranslation('tasks')
  const { scrollIntoTask } = useTasks()

  const parentData = taskRegistry.value.get(parentTask)
  const title = parentData?.title || t('unknownTask')
  const text = t('parentTask', { title })

  return (
    <Box
      className='flex'
      alignItems='center'
      sx={{ cursor: 'pointer', py: 0.5 }}
      onClick={() => scrollIntoTask(parentTask)}>
      <Box className='flex flex-center' gap={0.5}>
        <LinkIcon fontSize='small' />
        <Typography
          variant='caption'
          color='textSecondary'
          sx={{
            display: 'inline-block',
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            textWrap: 'nowrap',
            maxWidth: { xs: '25ch', mobile: '35ch', tablet: '50ch' }
          }}>
          {text}
        </Typography>
      </Box>
    </Box>
  )
}
