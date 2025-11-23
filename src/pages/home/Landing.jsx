import Link from '@components/reusable/Link'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import AppBar from '@components/ui/appbar/AppBar'
import LangUpdater from '@components/ui/buttons/LangUpdater'
import ThemeUpdater from '@components/ui/buttons/ThemeUpdater'
// components
import ChevronIcon from '@mui/icons-material/ChevronLeft'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Cards from './components/Cards'
import LoginSection from './components/LoginSection'
import MainText from './components/MainText'
import Section from './components/Section'

// hooks
import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'
import useUser from '@hooks/useUser'
import { styled, useTheme } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

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

  useEffect(() => {
    const handleResize = () => {
      const newHeight = mainTextRef.current
        ? mainTextRef.current.clientHeight
        : 0

      setMainTextHeight(newHeight)
    }

    // wait until the landing resource loads... otherwise the cards aren't going
    // to be animated
    if (!loadingResources) {
      handleResize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [loadingResources])

  const mainTextProps = {
    userTheme,
    section1
  }

  if (loadingResources) return <CircleLoader height='100dvh' />

  return (
    <Box
      sx={{
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
        minHeight: '100dvh'
      }}>
      <AppBar sx={{ justifyContent: 'space-between', px: 2 }} top>
        <Link
          to='/'
          className='flex flex-center'
          gap={1}
          color='textPrimary'
          sx={{ textDecoration: 'none' }}>
          <img
            src='/images/taskflow_icon.png'
            alt='TaskFlow'
            width={30}
            height={30}
          />
          <Typography sx={{ ...theme.typography.h6 }}>TaskFlow</Typography>
        </Link>
        <Box className='flex flex-center' gap={2}>
          <ThemeUpdater />
          <LangUpdater reloadOnChange />
        </Box>
      </AppBar>

      <Section ref={section1} id='main-text' pb={appBarHeight}>
        <MainText ref={mainTextRef} {...mainTextProps} />
      </Section>

      <Section id='cards' sx={{ gap: 5, justifyContent: 'start' }}>
        <Cards mainTextHeight={mainTextHeight} userTheme={userTheme} />
      </Section>

      <LoginSection userTheme={userTheme} />
    </Box>
  )
}
