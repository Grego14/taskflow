import { Suspense, lazy, useState, useMemo, useEffect } from 'preact/compat'

import ProjectItemsSkeleton from './ProjectItemsSkeleton'

const ProjectItems = lazy(() => import('./ProjectItems'))
const ToggleProjectDrawer = lazy(() => import('@components/ui/projects/ToggleProjectDrawer'))

import AppBar from '@components/ui/appbar/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const PROJECT_ACTIONS = ['/settings', '/metrics']

import '@styles/components/ui/appbar/projectAppBar.css'

export default function ProjectAppBar() {
  const { t } = useTranslation('ui')
  const { pathname } = useLocation()

  const { isOnlyMobile, isMobile } = useApp()
  const { data, id } = useProject()

  const [isReady, setIsReady] = useState(false)

  const { action, isProjectSubRoute } = useMemo(() => {
    const projectRute = pathname?.split(id)?.[1]
    const action = projectRute === 'dashboard' ? '' : projectRute

    return {
      action,
      isProjectSubRoute: PROJECT_ACTIONS.find(pAction => pAction === action)
    }
  }, [pathname, id])

  // trigger the appbar animation again if the user moves from one
  // projectSubRoute to the dashboard so the other bar actions are animated
  useEffect(() => {
    if (action === '/') setIsReady(false)

    // trigger the appbar animation manually as the ToggleProjectDrawer isn't
    // rendered on this condition
    if(isProjectSubRoute && !isMobile) setIsReady(true)
  }, [pathname, isMobile, isProjectSubRoute])

  const actionContainerClass = [
    'project-action-container',
    `${isMobile ? 'flex flex-column' : 'flex flex-center'}`
  ].join(' ')

  const appBarClass = 
    `project-appbar ${isProjectSubRoute ? 'is-project-subrute' : ''}`

  return (
    <AppBar
      className={appBarClass}
      animate={isReady}
      animateY
      noRotate={!isMobile}
      withDrawer={!isMobile}
      top={!isMobile}
      noTexts
      shadow='var(--mui-palette-shadows-appbar)'>
      {isProjectSubRoute ? (
        <Box className='flex flex-grow' gap={2}>
          {isMobile && (
            <Suspense fallback={null}>
              <ToggleProjectDrawer
                onMount={() => setIsReady(true)}
                onList={false}
              />
            </Suspense>
          )}

          <Box className={actionContainerClass}>
            <Typography variant='h1' className='project-action-title'>
              {t(`projectActions.${action?.replace('/', '')}`)}
            </Typography>
            <Typography
              className='project-id-text'
              variant='body2'
              color='textSecondary'>
              {id}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Suspense fallback={<ProjectItemsSkeleton />}>
          <ProjectItems onMount={() => setIsReady(true)} />
        </Suspense>
      )}
    </AppBar>
  )
}
