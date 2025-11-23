import Box from '@mui/material/Box'
import { Suspense, lazy, useMemo, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'

import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import { useMediaQuery } from '@mui/material'

const LayoutAppBar = lazy(() => import('./components/LayoutAppBar'))
const AppDrawer = lazy(() => import('@components/ui/drawer/AppDrawer'))

import LayoutContext from '@context/LayoutContext/context'

import { getItem } from '@utils/storage'

export default function LayoutManager() {
  const { isMobile, drawerWidth, appBarHeight } = useApp()
  const { uid } = useUser()
  const { projectId } = useParams()
  const location = useLocation()

  const [drawerOpen, setDrawerOpen] = useState(getItem('drawerOpen'))

  const isOnProjectRute = location.state?.fromProject

  const value = useMemo(
    () => ({
      toggleDrawer: state => setDrawerOpen(state)
    }),
    []
  )

  return (
    <LayoutContext.Provider value={value}>
      {uid && (
        <Suspense>
          <LayoutAppBar projectId={projectId} />
          {!isMobile && <AppDrawer open={drawerOpen} setOpen={setDrawerOpen} />}
        </Suspense>
      )}

      <Box
        minHeight='100dvh'
        marginLeft={`${uid ? drawerWidth?.closed : 0}px`}
        className='flex flex-column'
        pb={isMobile ? appBarHeight : 0}>
        <Outlet />
      </Box>
    </LayoutContext.Provider>
  )
}
