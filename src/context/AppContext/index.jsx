import { useCallback, useMemo, useState, lazy, Suspense } from 'react'
import { useColorScheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import UserProvider from '@context/UserContext'
import AppContext from './context'
import AppRoutes from '@/AppRoutes.jsx'

const Notification = lazy(() => import('@components/ui/notification/Notification'))

const DRAWER_CONFIG = {
  widthOpen: 260,
  widthClosedDesktop: 64
}

export default function AppProvider({ children }) {
  const { mode } = useColorScheme()

  const [notification, setNotification] = useState(null)
  const [isOffline, setIsOffline] = useState(false)

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('tablet'))
  const isOnlyMobile = useMediaQuery(theme => theme.breakpoints.down('mobile'))

  const appNotification = useCallback(payload => {
    if (!payload) {
      setNotification(null)
      return
    }

    const { message, status = 'success', open, ...rest } = payload
    setNotification({
      ...rest,
      message,
      status,
      open: open ?? !!message
    })
  }, [])

  const contextValue = useMemo(() => {
    const appBarHeight = isMobile ? '3.8rem' : '3.4rem'

    return {
      notification,
      isMobile,
      isOnlyMobile,
      appBarHeight,
      drawerWidth: {
        open: DRAWER_CONFIG.widthOpen,
        closed: isMobile ? 0 : DRAWER_CONFIG.widthClosedDesktop
      },
      isOffline,
      setIsOffline,
      appNotification
    }
  }, [notification, isMobile, isOnlyMobile, isOffline, appNotification])

  if (!mode) return null

  return (
    <AppContext.Provider value={contextValue}>
      <UserProvider>
        {/* the smooth scroll is only used on the landing page */}
        <div id='smooth-wrapper'>
          <div id='smooth-content'>
            <AppRoutes />
          </div>
        </div>
      </UserProvider>

      {notification?.open && (
        <Suspense fallback={null}>
          <Notification />
        </Suspense>
      )}
    </AppContext.Provider>
  )
}
