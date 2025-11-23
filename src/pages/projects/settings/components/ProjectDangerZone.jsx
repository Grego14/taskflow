import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import ArchiveProject from './ArchiveProject'
import DeleteProject from './DeleteProject'

import useApp from '@hooks/useApp'
import { useTranslation } from 'react-i18next'

export default function ProjectDangerZone({ isOwner, isArchived }) {
  const { t } = useTranslation('ui')
  const { appBarHeight, isMobile } = useApp()

  return (
    <Box className='flex flex-column' mb={3}>
      <Typography variant='h6' color='error'>
        {t('projects.settings.dangerTitle')}
      </Typography>
      <Typography variant='body2'>
        {t('projects.settings.dangerSubtitle')}
      </Typography>

      <Box
        className={`flex ${isMobile ? 'flex-column' : ''}`}
        gap={2}
        width='25rem'
        mx={isMobile ? 'auto' : ''}
        mt={4}>
        <DeleteProject isArchived={isArchived} isOwner={isOwner} />
        <ArchiveProject isArchived={isArchived} isOwner={isOwner} />
      </Box>
    </Box>
  )
}
