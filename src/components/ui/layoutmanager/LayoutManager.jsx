import Box from '@mui/material/Box'
import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'

import useApp from '@hooks/useApp'
import useDebounce from '@hooks/useDebounce'
import useUser from '@hooks/useUser'
import { useMediaQuery } from '@mui/material'
import useLayout from '@hooks/useLayout'

const LayoutAppBar = lazy(() => import('./components/LayoutAppBar'))
const AppDrawer = lazy(() => import('@components/ui/drawer/AppDrawer'))

import { getItem } from '@utils/storage'

export default function LayoutManager() {
  const { isMobile, drawerWidth, appBarHeight } = useApp()
  const { uid } = useUser()
  const { projectId } = useParams()

  const { drawerOpen, setDrawerOpen } = useLayout()

  return (
    <>
      {uid && (
        <Suspense fallback={null}>
          <LayoutAppBar projectId={projectId} />
          {!isMobile && (
            <AppDrawer open={drawerOpen} setOpen={setDrawerOpen} />
          )}
        </Suspense>
      )}

      <Box
        component='main'
        minHeight='100dvh'
        marginLeft={`${uid && !isMobile ? drawerWidth?.closed : 0}px`}
        className='flex flex-column'
        pb={isMobile ? appBarHeight : 0}
      >
        <Outlet />
      </Box>
    </>
  )
}
