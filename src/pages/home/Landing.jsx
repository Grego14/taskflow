// components
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import Box from '@mui/material/Box'
import Cards from './components/Cards'
import LandingAppBar from './components/LandingAppBar'
import LoginSection from './components/LoginSection'
import MainText from './components/MainText'

// hooks
import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'
import useUser from '@hooks/useUser'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import { alpha } from '@mui/material/styles'
import setPageTitle from '@utils/setPageTitle'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

export default function Landing() {
  const { preferences } = useUser()
  const userTheme = preferences.theme

  const { isMobile, appBarHeight } = useApp()
  const { t } = useTranslation(['landing', 'common'])

  // common is already loaded by the AppRoutes
  const loadingResources = useLoadResources('landing')

  const [showAppBar, setShowAppBar] = useState(false)

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
          backgroundColor: alpha(theme.palette.primary.main, 0.05)
        })
      ]}
      component='main'>
      <LandingAppBar show={showAppBar} />
      <MainText userTheme={userTheme} setShowAppBar={setShowAppBar} />
      <Cards userTheme={userTheme} />
      <LoginSection userTheme={userTheme} />
    </Box>
  )
}
