import { lazy, Suspense, useEffect, memo, useMemo } from 'preact/compat'

import Link from '@components/reusable/Link'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import TasksPreviewer from '@components/ui/tasks/TasksPreviewer'
import BreadcrumbIcon from '@mui/icons-material/NavigateNext'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import FocusManager from './FocusManager'

const ArchiveButton = lazy(() => import('@components/ui/tasks/buttons/ArchiveButton'))

import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import useLoadResources from '@hooks/useLoadResources'
import useApp from '@hooks/useApp'
import useLayout from '@hooks/useLayout'
import useTaskMetrics from '@hooks/tasks/useTaskMetrics'
import { useGSAP } from '@gsap/react'

import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

import { taskRegistry } from '@stores/task'

const ProjectHeader = memo(({ projectName, isArchived }) => {
  const { isMobile } = useApp()
  const { t } = useTranslation('projects')
  const { isPreview } = useLayout()

  const containerStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: { xs: 'column', tablet: 'row' },
    gap: 2,
    alignItems: 'center',
    mt: 2,
    px: { xs: 0, tablet: 2 },
    justifyContent: { xs: 'center', tablet: 'start' }
  }), [])

  return (
    <Box sx={containerStyles}>
      <Breadcrumbs
        separator={<BreadcrumbIcon fontSize='small' />}
        sx={{ width: 'fit-content' }}>
        <Link
          underline='hover'
          color='inherit'
          to={isPreview ? '' : '/projects'}>
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

      {/* Portal target for the Zen Mode laptop/desktop button */}
      <Box id='zen-portal-root' ml='auto' />

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
})

export default function ProjectDashBoard() {
  const { t } = useTranslation('projects')
  const { data, isArchived } = useProject()
  const { isMobile } = useApp()

  const registrySize = taskRegistry.value.size
  const loadingResources = useLoadResources('tasks')

  useGSAP(() => {
    // only refresh if we have actual tasks to avoid useless calculations
    if (registrySize > 0) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 150)

      return () => clearTimeout(timer)
    }
  }, { dependencies: [registrySize] })

  useTaskMetrics()

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

      <FocusManager />
    </Box>
  )
}
