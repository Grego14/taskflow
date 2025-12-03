import { useEffect, useState, Suspense, lazy } from 'react'

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
import { SplitText } from 'gsap/SplitText'

import setPageTitle from '@utils/setPageTitle'

gsap.registerPlugin(useGSAP, SplitText)

export default function Landing() {
  const { t } = useTranslation(['landing', 'common'])

  // common is already loaded by the AppRoutes
  const loadingResources = useLoadResources('landing')

  const [showAppBar, setShowAppBar] = useState(false)
  const [animationEnded, setAnimationEnded] = useState(false)

  // if the user logouts of his account we update the page title (the
  // RouteHandler is only available if the user is logged-in)
  useEffect(() => {
    setPageTitle(t('routes.home', { ns: 'common' }))
  }, [t])

  if (loadingResources) return <CircleLoader height='100dvh' />

  return (
    <Box
      sx={[
        theme => ({
          scrollBehavior: 'smooth',
          scrollSnapType: 'y mandatory',
          minHeight: '100dvh',
          backgroundColor: theme.alpha(theme.palette.primary.main, 0.05)
        })
      ]}
      component='main'>
      {animationEnded && <LandingAppBar show={showAppBar} />}

      <MainText
        setShowAppBar={setShowAppBar}
        animationEnded={setAnimationEnded}
      />

      {animationEnded && (
        <Suspense>
          <Cards />
          <LoginSection />
        </Suspense>
      )}
    </Box>
  )
}
