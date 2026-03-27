import { lazy, Suspense, useEffect } from 'preact/compat'

import Link from '@components/reusable/Link'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import TasksPreviewer from '@components/ui/tasks/TasksPreviewer'
import BreadcrumbIcon from '@mui/icons-material/NavigateNext'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

const ArchiveButton = lazy(() => import('@components/ui/tasks/buttons/ArchiveButton'))

import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import useLoadResources from '@hooks/useLoadResources'
import useApp from '@hooks/useApp'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ProjectHeader = ({ projectName, isArchived }) => {
  const { isMobile } = useApp()
  const { t } = useTranslation('projects')

  // avoid refreshing everytime the items or subtasks changes
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])

  return (
    <Box
      display='flex'
      flexDirection={{ xs: 'column', tablet: 'row' }}
      gap={2}
      alignItems='center'
      mt={2}
      px={{ xs: 0, tablet: 2 }}
      justifyContent={{ xs: 'center', tablet: 'start' }}>
      <Breadcrumbs
        separator={<BreadcrumbIcon fontSize='small' />}
        sx={{ width: 'fit-content' }}>
        <Link underline='hover' color='inherit' to='/projects'>
          {t('text')}
        </Link>

        {projectName && (
          <Typography variant='body2' color='textPrimary'>
            {projectName}
          </Typography>
        )}
      </Breadcrumbs>

      {isMobile && (
        <Suspense fallback={null}>
          <ArchiveButton />
        </Suspense>
      )}

      {isArchived && (
        <Chip
          variant='outlined'
          label={t('archived')}
          size='small'
          color='warning'
          sx={{ alignSelf: { xs: 'flex-start', mobile: 'center' } }}
        />
      )}
    </Box>
  )
}

export default function ProjectDashBoard() {
  const { t } = useTranslation('projects')
  const { data, isArchived } = useProject()

  const projectName = data?.name
  const loadingResources = useLoadResources('tasks')

  if (!data || loadingResources) {
    return (
      <Box
        className='flex flex-center flex-grow'
        width='100%'>
        <CircleLoader text={t('loadingProject')} />
      </Box>
    )
  }

  return (
    <Box
      className='flex flex-column flex-grow'
      width='100%'
      ml='auto'
      justifyContent={!data ? 'center' : 'initial'}>
      <ProjectHeader projectName={data.name} isArchived={isArchived} />

      {isArchived && (
        <Typography textAlign='center' my={2} color='warning.main'>
          {t('cantUpdateArchived')}
        </Typography>
      )}

      <TasksPreviewer />
    </Box>
  )
}
