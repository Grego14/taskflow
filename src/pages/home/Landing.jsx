import { useEffect, useState, Suspense, lazy } from 'react'

// components
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import Box from '@mui/material/Box'
import MainText from './components/MainText'

const LandingAppBar = lazy(() => import('./components/LandingAppBar'))
const Cards = lazy(() => import('./components/Cards'))
const LoginSection = lazy(() => import('./components/LoginSection'))

// hooks
import useLoadResources from '@hooks/useLoadResources'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTheme } from '@mui/material/styles'
import useApp from '@hooks/useApp'

import { SplitText } from 'gsap/SplitText'

import setPageTitle from '@utils/setPageTitle'

gsap.registerPlugin(useGSAP, SplitText)

let authPrefetched = false

const handlePrefetch = () => {
  if (authPrefetched) return

  import('@pages/auth/Auth')
  authPrefetched = true
}

export default function Landing() {
  const { t } = useTranslation(['landing', 'common'])
  const theme = useTheme()
  const { isOnlyMobile } = useApp()

  // common is already loaded by the AppRoutes
  const loadingResources = useLoadResources('landing')

  const [showAppBar, setShowAppBar] = useState(false)
  const [mainEnded, setMainEnded] = useState(false)
  const [cardsEnded, setCardsEnded] = useState(false)

  const landingBg = theme.alpha(theme.palette.primary.main, 0.05)

  // if the user logouts of his account we update the page title (the
  // RouteHandler is only available if the user is logged-in)
  useEffect(() => {
    setPageTitle(t('routes.home', { ns: 'common' }))
  }, [t])

  useEffect(() => {
    let smoother

    const initGSAPPlugins = async () => {
      const [{ ScrollTrigger }, { ScrollSmoother }] = await Promise.all([
        import('gsap/ScrollTrigger'),
        import('gsap/ScrollSmoother')
      ])

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

      smoother = ScrollSmoother.create({
        smooth: 1,
        smoothTouch: 0.1
      })

      ScrollTrigger.refresh()
    }

    if (!loadingResources) initGSAPPlugins()

    return () => smoother?.kill?.()
  }, [loadingResources])

  if (loadingResources) return <CircleLoader height='100dvh' />

  return (
    <Box sx={{ backgroundColor: landingBg }} component='main'>
      {mainEnded &&
        <Suspense fallback={null}>
          <LandingAppBar show={showAppBar} />
        </Suspense>
      }

      <ScreenWrapper>
        <MainText
          showAppBar={() => setShowAppBar(true)}
          setAnimationEnded={() => setMainEnded(true)}
          prefetchAuth={handlePrefetch}
        />
      </ScreenWrapper>

      <ScreenWrapper height={isOnlyMobile ? null : '80dvh'}>
        {mainEnded && (
          <Cards
            setAnimationEnded={() => setCardsEnded(true)}
            bg={landingBg}
          />
        )}
      </ScreenWrapper>
      <ScreenWrapper>
        {cardsEnded &&
          <LoginSection
            gradientFrom={landingBg}
            prefetchAuth={handlePrefetch}
          />
        }
      </ScreenWrapper>
    </Box>
  )
}

function ScreenWrapper({ children, height = '100dvh' }) {
  return (
    <Box sx={{
      minHeight: height,
      display: 'flex',
      minWidth: '100dvw',
      flexDirection: 'column'
    }}>
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Box>
  )
}
