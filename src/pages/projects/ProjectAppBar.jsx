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

  // trigger the app bar animation again if the user moves from one
  // projectSubRoute to the dashboard so the other bar actions are animated
  useEffect(() => {
    if (action === '/') setIsReady(false)
  }, [pathname])

  return (
    <AppBar
      animate={isReady}
      animateY
      noRotate={!isMobile}
      withDrawer={!isMobile}
      top={!isMobile}
      sx={theme => ({
        backgroundImage: theme.palette.background.appbar.top,
        boxShadow: theme.palette.shadows.appbar,
        px: {
          xs: 2,
          mobile: 4,
          // reset the padding when the appbar is on top
          tablet: 2
        }
      })}>
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

          <Box
            className={`${isMobile ? 'flex flex-column' : 'flex flex-center'}`}
            gap={{ mobile: 0, tablet: 2 }}>
            <Typography
              variant='h1'
              sx={[theme => ({ ...theme.typography.h5, fontWeight: 600 })]}>
              {t(`projectActions.${action?.replace('/', '')}`)}
            </Typography>
            <Typography
              variant='body2'
              sx={[
                theme => ({
                  ...theme.typography.body2,
                  ml: { mobile: 0, tablet: 'auto' }
                })
              ]}
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
