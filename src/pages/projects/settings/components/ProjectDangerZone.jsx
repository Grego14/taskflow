import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Suspense, lazy } from 'preact/compat'

const AbandonProject = lazy(() => import('@components/ui/projects/actions/AbandonProject'))
const DeleteProject = lazy(() => import('@components/ui/projects/actions/DeleteProject'))
const ArchiveProject = lazy(() => import('@components/ui/projects/actions/ArchiveProject'))

export default function ProjectDangerZone({ isOwner, isArchived }) {
  const { t } = useTranslation('projects')
  const { isMobile } = useApp()
  const { data } = useProject()
  const navigate = useNavigate()

  const id = data?.id
  const owner = data?.createdBy

  return (
    <Box className='flex flex-column' mb={3}>
      <Typography variant='h6' color='error'>
        {t('settings.dangerTitle')}
      </Typography>
      <Typography variant='body2' sx={{ mb: 2 }}>
        {t('settings.dangerSubtitle')}
      </Typography>

      <Box
        className='flex flex-column'
        sx={{
          gap: 2,
          maxWidth: '25rem',
          mt: 2
        }}
      >
        <Suspense fallback={null}>
          {isOwner && (
            <Box className='flex flex-column' gap={2}>
              <DeleteProject
                id={id}
                owner={owner}
                asButton
                disabled={!isOwner}
                onDelete={() => navigate('/projects')}
              />

              <ArchiveProject asButton id={id} disabled={isArchived} />
            </Box>
          )}

          {!isOwner && (
            <AbandonProject id={id} owner={owner} asButton />
          )}
        </Suspense>
      </Box>
    </Box>
  )
}
