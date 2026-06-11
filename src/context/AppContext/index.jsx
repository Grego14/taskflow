import {
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
import GlobalTooltipHandler from '@components/reusable/GlobalTooltipHandler'

const GlobalAlert = lazy(() => import('@components/ui/alert/GlobalAlert'))
const GlobalTooltipUI = 
  lazy(() => import('@components/reusable/GlobalTooltipUI'))

import { BREAKPOINTS } from '@/theme'
import { globalAlert, setGlobalAlert, tooltipTarget } from '@stores/ui'

export default function AppProvider({ children }) {
  const { mode } = useColorScheme()
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

  const contextValue = useMemo(() => ({
    ...layout,
    isOffline,
    setIsOffline
  }), [isOffline, layout])

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

      <GlobalTooltipHandler/>

      {tooltipTarget.value && (
        <Suspense fallback={null}>
          <GlobalTooltipUI />
        </Suspense>
      )}

      {globalAlert.value?.open && (
        <Suspense fallback={null}>
          <GlobalAlert />
        </Suspense>
      )}
    </AppContext.Provider>
  )
}
