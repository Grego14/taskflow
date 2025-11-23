import Link from '@components/reusable/Link'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import TasksPreviewer from '@components/ui/tasks/TasksPreviewer'
import TasksProvider from '@context/TasksContext'
import BreadcrumbIcon from '@mui/icons-material/NavigateNext'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// hooks
import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// utils
import setPageTitle from '@utils/setPageTitle'
import { getItem } from '@utils/storage.js'

export default function ProjectDashBoard() {
  const { t } = useTranslation('ui')
  const { data, updatePreviewer, isArchived, metrics } = useProject()
  const { isMobile, drawerWidth, isOnlyMobile } = useApp()
  const { preferences } = useUser()

  const projectName = data?.name

  useEffect(() => {
    if (projectName) setPageTitle(projectName)
  }, [projectName])

  return (
    <Box
      className='flex flex-column flex-grow'
      width='100%'
      marginLeft='auto'
      justifyContent={!data ? 'center' : 'initial'}>
      {!data ? (
        <CircleLoader text={t('projects.loadingProject')} />
      ) : (
        <>
          <Box
            className={`flex${isMobile ? ' flex-column' : ''}`}
            gap={2}
            alignItems={isOnlyMobile ? 'center' : 'center'}
            mt={2}
            px={!isMobile ? 2 : 0}
            justifyContent={isMobile ? 'center' : null}>
            <Breadcrumbs
              separator={<BreadcrumbIcon fontSize='small' />}
              sx={{ width: 'fit-content' }}>
              <Link underline='hover' color='inherit' to='/projects'>
                {t('projects.text')}
              </Link>

              {projectName && (
                <Typography
                  variant='body2'
                  alignSelf='center'
                  color='textPrimary'>
                  {projectName}
                </Typography>
              )}
            </Breadcrumbs>
            {isArchived && (
              <Chip
                variant='outlined'
                label={t('projects.archived')}
                size='small'
                color='warning'
                sx={{ alignSelf: isOnlyMobile ? 'start' : null }}
              />
            )}
          </Box>

          {isArchived && (
            <Typography className='text-center' my={2} color='warning'>
              {t('projects.cantUpdateArchived')}
            </Typography>
          )}

          <TasksProvider>
            <TasksPreviewer actualPreview={preferences.previewer || 'list'} />
          </TasksProvider>
        </>
      )}
    </Box>
  )
}
