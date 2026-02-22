import { Suspense, lazy } from 'react'

const ProjectItems = lazy(() => import('./ProjectItems'))
const ToggleProjectDrawer = lazy(() => import('@components/ui/projects/ToggleProjectDrawer'))

import AppBar from '@components/ui/appbar/AppBar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

const PROJECT_ACTIONS = ['/settings', '/metrics']

export default function ProjectAppBar() {
  const { t } = useTranslation('ui')
  const { isOnlyMobile, isMobile } = useApp()
  const { data, id } = useProject()
  const navigate = useNavigate()

  const location = useLocation()
  const projectRute = location.pathname?.split(id)?.[1]
  const action = projectRute === 'dashboard' ? '' : projectRute
  const isProjectSubRoute = PROJECT_ACTIONS.find(pAction => pAction === action)

  return (
    <AppBar top>
      {isProjectSubRoute ? (
        <Box className='flex flex-grow' gap={1.5} px={2}>
          <Suspense fallback={null}>
            <ToggleProjectDrawer />
          </Suspense>

          <Box
            className={`${isMobile ? 'flex flex-column' : 'flex flex-center'}`}
            gap={isMobile ? 0 : 2}>
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
                  ml: isMobile ? 0 : 'auto'
                })
              ]}
              color='textSecondary'>
              {id}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Suspense fallback={null}>
          <ProjectItems />
        </Suspense>
      )}
    </AppBar>
  )
}
