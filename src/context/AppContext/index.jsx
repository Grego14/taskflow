// hooks
import useMediaQuery from '@mui/material/useMediaQuery'
import { useCallback, useMemo, useReducer, useState } from 'react'

// utils
import {
  ACTION_TYPES,
  appStateReducer,
  initAppState
} from './appStateReducer.js'
import AppContext from './context'

export default function AppProvider({ children }) {
  const [appState, dispatch] = useReducer(appStateReducer, {}, initAppState)
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('tablet'))
  const isOnlyMobile = useMediaQuery(theme => theme.breakpoints.down('mobile'))
  const [lastRute, setLastRute] = useState('/')

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
      appBarHeight,
      appNotification,
      setLastRute,
      lastRute
    }),
    [appState, appBarHeight, isMobile, isOnlyMobile, appNotification, lastRute]
  )

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}
