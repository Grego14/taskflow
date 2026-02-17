import { Suspense, lazy, memo, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'

import Box from '@mui/material/Box'
import LayoutAppBar from '@components/ui/layoutmanager/components/LayoutAppBar'

const AppDrawer = lazy(() => import('@components/ui/drawer/AppDrawer'))

export default memo(function LayoutManager() {
  const { isMobile, drawerWidth, appBarHeight } = useApp()
  const loadingResource = useLoadResources('ui')

  return (
    <Box>
      <LayoutAppBar />

      <Suspense fallback={null}>
        {!isMobile && <AppDrawer />}
      </Suspense>

      <Box
        component='main'
        minHeight='100dvh'
        marginLeft={`${!isMobile ? drawerWidth?.closed : 0}px`}
        className='flex flex-column'
        py={2}
        pb={isMobile ? appBarHeight : 0}>
        <Outlet />
      </Box>
    </Box>
  )
})
