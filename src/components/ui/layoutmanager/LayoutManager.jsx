import { Suspense, lazy, memo, useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'

import Box from '@mui/material/Box'

const LayoutAppBar = lazy(() => import('./components/LayoutAppBar'))
const AppDrawer = lazy(() => import('@components/ui/drawer/AppDrawer'))

export default memo(function LayoutManager() {
  const { isMobile, drawerWidth, appBarHeight } = useApp()
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
        marginLeft={`${!isMobile ? drawerWidth?.closed : 0}px`}
        className='flex flex-column'
        pb={isMobile ? appBarHeight : 0}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  )
})
