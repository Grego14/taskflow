// components
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import ChevronIcon from '@mui/icons-material/ChevronLeft'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Cards from './components/Cards'
import LoginSection from './components/LoginSection'
import MainText from './components/MainText'
import Section from './components/Section'
import LandingAppBar from './components/LandingAppBar'

// hooks
import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'
import useUser from '@hooks/useUser'
import { styled, useTheme } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import setPageTitle from '@utils/setPageTitle'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

export default function Landing() {
  const { preferences } = useUser()
  const userTheme = preferences.theme

  const { isMobile, appBarHeight } = useApp()
  const theme = useTheme()
  const { t, i18n } = useTranslation(['landing', 'common'])

  // common is already loaded by the AppRoutes
  const loadingResources = useLoadResources('landing')

  const section1 = useRef(null)
  const mainTextRef = useRef(null)

  const [mainTextHeight, setMainTextHeight] = useState(
    mainTextRef.current?.clientHeight || 0
  )

  const [showAppBar, setShowAppBar] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const newHeight = mainTextRef.current
        ? mainTextRef.current.clientHeight
        : 0

      setMainTextHeight(newHeight)
    }

    setPageTitle(t('routes.home', { ns: 'common' }))

    // wait until the landing resource loads... otherwise the cards aren't going
    // to be animated
    if (!loadingResources) {
      handleResize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [loadingResources, t])

  const mainTextProps = {
    userTheme,
    setShowAppBar
  }

  if (loadingResources) return <CircleLoader height='100dvh' />

  return (
    <Box
      sx={{
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
        minHeight: '100dvh'
      }}>
      <LandingAppBar show={showAppBar} />

      <Section ref={section1} id='main-text'>
        <MainText ref={mainTextRef} {...mainTextProps} />
      </Section>

      <Cards mainTextHeight={mainTextHeight} userTheme={userTheme} />

      <LoginSection userTheme={userTheme} />
    </Box>
  )
}
