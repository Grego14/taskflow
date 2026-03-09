import { Suspense, lazy, memo } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'

const LayoutAppBar = lazy(() => import('./components/LayoutAppBar'))
const AppDrawer = lazy(() => import('@components/ui/drawer/AppDrawer'))

import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'

import { DRAWER_CONFIG, APPBAR_HEIGHT } from '@/constants'

export default memo(function LayoutManager() {
  const { isMobile } = useApp()
  const { projectId } = useParams()
  const loadingResource = useLoadResources('ui')

  return (
    <Box>
      <Suspense fallback={null}>
        {!projectId && <LayoutAppBar />}
      </Suspense>

      <Suspense fallback={null}>
        {(!isMobile || (isMobile && projectId)) && <AppDrawer />}
      </Suspense>

      <Box
        component='main'
        minHeight='100dvh'
        pl={`${!isMobile ? DRAWER_CONFIG.widthClosed : 0}px`}
        sx={theme => ({ backgroundImage: theme.palette.background.app })}
        className='flex flex-column'
        pb={isMobile ? APPBAR_HEIGHT.mobile : 0}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  )
})
