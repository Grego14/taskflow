import Box from '@mui/material/Box'
import { Suspense, lazy, useMemo, useState, useEffect } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'

import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import { useMediaQuery } from '@mui/material'
import useDebounce from '@hooks/useDebounce'

const LayoutAppBar = lazy(() => import('./components/LayoutAppBar'))
const AppDrawer = lazy(() => import('@components/ui/drawer/AppDrawer'))

import LayoutContext from '@context/LayoutContext/context'

import { getItem } from '@utils/storage'

export default function LayoutManager() {
  const { isMobile, drawerWidth, appBarHeight } = useApp()
  const { uid, userLoaded, update, metadata } = useUser()
  const { projectId } = useParams()
  const location = useLocation()

  const [drawerOpen, setDrawerOpen] = useState(getItem('drawerOpen'))

  // use a local filter so the user see the filter update faster. Also allow
  // filtering tasks when the user has no connection
  const [filter, setFilter] = useState('default')

  const [debounceUpdater] = useDebounce(async data => {
    const { previewer, filter, type } = data

    // update before updating the document so if the user has no internet
    // connection he can filter the tasks offline
    if (type === 'filter') setFilter(filter)

    await update(
      previewer
        ? { previewer: previewer }
        : filter
          ? { lastUsedFilter: filter }
          : null
    )
  }, 1500)

  // update the filter when the user document loads
  useEffect(() => {
    if (userLoaded) setFilter(metadata?.lastUsedFilter || 'default')
  }, [userLoaded, metadata])

  const isOnProjectRute = location.state?.fromProject

  const value = useMemo(
    () => ({
      toggleDrawer: state => setDrawerOpen(state),
      filter,
      setFilter,
      updatePreiewer: previewer =>
        debounceUpdater({ previewer, type: 'previewer' }),
      updateFilter: filter => debounceUpdater({ filter, type: 'filter' })
    }),
    [filter, debounceUpdater]
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
        component='main'
        pb={isMobile ? appBarHeight : 0}>
        <Outlet />
      </Box>
    </LayoutContext.Provider>
  )
}
