import useAuth from '@hooks/useAuth.js'
import { useColorScheme } from '@mui/material/styles'
// hooks
import useMediaQuery from '@mui/material/useMediaQuery'
import { lazy, useCallback, useMemo, useReducer, useState } from 'react'

import UserContext from '@context/UserContext'
// utils
import {
  ACTION_TYPES,
  appStateReducer,
  initAppState
} from './appStateReducer.js'
import AppContext from './context'

const AppRoutes = lazy(() => import('@/AppRoutes.jsx'))
const Landing = lazy(() => import('@pages/home/Landing'))

export default function AppProvider({ children }) {
  const { currentUser } = useAuth()
  const [appState, dispatch] = useReducer(appStateReducer, {}, initAppState)
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('tablet'))
  const isOnlyMobile = useMediaQuery(theme => theme.breakpoints.down('mobile'))
  const [lastRute, setLastRute] = useState('/')
  const { mode } = useColorScheme()

  const [isOffline, setIsOffline] = useState(false)

  // used to manage the alignment of the AppDrawer and the AppBar
  const appBarHeight = isMobile ? '3.8rem' : '3.4rem'

  const appNotification = useCallback(data => {
    dispatch({ type: ACTION_TYPES.NOTIFICATION, payload: data })
  }, [])

  const contextValue = useMemo(
    () => ({
      ...appState,
      isMobile,
      isOnlyMobile,
      drawerWidth: {
        open: 260,
        // the drawer is replaced with an AppBar on mobile so we set width to 0
        closed: isMobile ? 0 : 64
      },
      isOffline: false,
      setIsOffline,
      appBarHeight,
      appNotification,
      setLastRute,
      lastRute
    }),
    [appState, appBarHeight, isMobile, isOnlyMobile, appNotification, lastRute]
  )

  const isAuthRute =
    location.pathname === '/login' || location.pathname === '/signup'

  if (!mode) return null

  return (
    <AppContext.Provider value={contextValue}>
      <UserContext>
        {!currentUser && !isAuthRute ? <Landing /> : <AppRoutes />}
      </UserContext>
    </AppContext.Provider>
  )
}
