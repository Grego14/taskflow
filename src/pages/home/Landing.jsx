import { useLayoutEffect, useEffect, useState, Suspense, lazy } from 'react'

// components
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import Box from '@mui/material/Box'
import LandingAppBar from './components/LandingAppBar'
import MainText from './components/MainText'

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
import ScrollSmoother from 'gsap/ScrollSmoother'
import ScrollTrigger from 'gsap/ScrollTrigger'

import setPageTitle from '@utils/setPageTitle'

gsap.registerPlugin(useGSAP, SplitText, ScrollSmoother, ScrollTrigger)

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

  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      smooth: 1,
      smoothTouch: 0.1
    })

    return () => smoother.kill()
  }, [])

  if (loadingResources) return <CircleLoader height='100dvh' />

  return (
    <Box sx={{ backgroundColor: landingBg }} component='main'>
      {mainEnded && <LandingAppBar show={showAppBar} />}

      <ScreenWrapper>
        <MainText
          showAppBar={() => setShowAppBar(true)}
          setAnimationEnded={() => setMainEnded(true)}
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
      <ScreenWrapper>{cardsEnded && <LoginSection gradientFrom={landingBg} />}</ScreenWrapper>
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
