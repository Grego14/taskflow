import {
  useCallback,
  useMemo,
  useState,
  lazy,
  Suspense,
  useEffect
} from 'preact/compat'
import { useColorScheme } from '@mui/material/styles'

import UserProvider from '@context/UserContext'
import AppContext from './context'
import AppRoutes from '@/AppRoutes.jsx'

const Notification = lazy(() => import('@components/ui/notification/Notification'))

import { BREAKPOINTS } from '@/theme'

export default function AppProvider({ children }) {
  const { mode } = useColorScheme()

  const [notification, setNotification] = useState(null)
  const [isOffline, setIsOffline] = useState(false)

  const [layout, setLayout] = useState({
    isMobile: window.innerWidth < BREAKPOINTS.tablet,
    isOnlyMobile: window.innerWidth < BREAKPOINTS.mobile
  })

  // use own logic to calculate the breakpoints so we can add a 
  // debounce of 150ms
  useEffect(() => {
    let timeoutId = null

    const handleResize = () => {
      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        const width = window.innerWidth

        setLayout({
          isMobile: width < BREAKPOINTS.tablet,
          isOnlyMobile: width < BREAKPOINTS.mobile
        })
      }, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

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

  const contextValue = useMemo(() => ({
    notification,
    ...layout,
    isOffline,
    setIsOffline,
    appNotification
  }), [notification, isOffline, appNotification, layout])

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
