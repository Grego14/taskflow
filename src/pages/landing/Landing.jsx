import { useEffect, useState, Suspense, lazy } from 'react'

import Box from '@mui/material/Box'
import MainText from './components/MainText'

const LandingAppBar = lazy(() => import('./components/LandingAppBar'))
const Cards = lazy(() => import('./components/Cards'))
const LoginSection = lazy(() => import('./components/LoginSection'))
const FaqSection = lazy(() => import('./components/FaqSection'))
const ContactSection = lazy(() => import('./components/ContactSection'))

import useLoadResources from '@hooks/useLoadResources'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useTheme } from '@mui/material/styles'
import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'

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
  const { initAuth } = useAuth()
  const { t } = useTranslation(['landing', 'common'])

  const theme = useTheme()
  const { isOnlyMobile } = useApp()

  // common is already loaded by the AppRoutes
  const loadingResources = useLoadResources('landing')

  const [showAppBar, setShowAppBar] = useState(false)
  const [mainEnded, setMainEnded] = useState(false)
  const [cardsEnded, setCardsEnded] = useState(false)
  const [faqEnded, setFaqEnded] = useState(false)
  const [contactEnded, setContactEnded] = useState(false)
  const [getPlugins, setGetPlugins] = useState(false)
  const [pluginsReady, setPluginsReady] = useState(false)

  const landingBg = theme.alpha(theme.palette.primary.main, 0.05)

  // if the user logouts of his account we update the page title (the
  // RouteHandler is only available if the user is logged-in)
  useEffect(() => {
    setPageTitle(t('routes.home', { ns: 'common' }))
  }, [t])

  useEffect(() => {
    if (!getPlugins) return

    let smoother

    const initGSAPPlugins = async () => {
      const [{ ScrollTrigger }, { ScrollSmoother }] = await Promise.all([
        import('gsap/ScrollTrigger'),
        import('gsap/ScrollSmoother')
      ])

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
      setPluginsReady(true)

      smoother = ScrollSmoother.create({
        smooth: 1,
        smoothTouch: 0.1
      })

      ScrollTrigger.refresh()
    }

    if (!loadingResources) initGSAPPlugins()

    return () => smoother?.kill?.()
  }, [loadingResources, getPlugins])

  const handleMainAnim = () => {
    setMainEnded(true)

    initAuth()
    setGetPlugins(true)
  }

  const bgColor = { backgroundColor: landingBg }

  return (
    <Box
      sx={{
        backgroundImage: `
        radial-gradient(circle at 15% 25%, ${theme.palette.primary.main}18 0%, transparent 60%),
        radial-gradient(circle at 85% 75%, ${theme.palette.secondary.main}20 0%, transparent 60%)
        `,
        backgroundAttachment: 'fixed',
        transition: 'background 0.5s ease'
      }}
      component='main'>
      {showAppBar &&
        <Suspense fallback={null}>
          <LandingAppBar />
        </Suspense>
      }

      <ScreenWrapper>
        <MainText
          setAnimationEnded={handleMainAnim}
          prefetchAuth={handlePrefetch}
          animationEnded={mainEnded}
        />
      </ScreenWrapper>

      <ScreenWrapper height={{ xs: 'auto', mobile: '100dvh' }}>
        {mainEnded && (
          <Cards
            setAnimationEnded={() => setCardsEnded(true)}
            showAppBar={() => setShowAppBar(true)}
            bg={landingBg}
            pluginsReady={pluginsReady}
          />
        )}
      </ScreenWrapper>
      <ScreenWrapper sx={bgColor} height='75dvh'>
        {cardsEnded && (
          <FaqSection setAnimationEnded={() => setFaqEnded(true)} />
        )}
      </ScreenWrapper>

      <ScreenWrapper sx={bgColor} height='50dvh'>
        {faqEnded && (
          <ContactSection setAnimationEnded={() => setContactEnded(true)} />
        )}
      </ScreenWrapper>

      <ScreenWrapper sx={bgColor} height='115dvh'>
        {contactEnded &&
          <LoginSection
            prefetchAuth={handlePrefetch}
          />
        }
      </ScreenWrapper>
    </Box>
  )
}

function ScreenWrapper({ children, height = '100dvh', sx }) {
  return (
    <Box sx={{
      minHeight: height,
      display: 'flex',
      minWidth: '100dvw',
      flexDirection: 'column',
      ...sx
    }}>
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Box>
  )
}
