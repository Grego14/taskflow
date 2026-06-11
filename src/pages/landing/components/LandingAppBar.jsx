import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AppBar from '@components/ui/appbar/AppBar'
import Link from '@components/reusable/Link'
import LangUpdater from '@components/ui/buttons/LangUpdater'
import ThemeUpdater from '@components/ui/buttons/ThemeUpdater'
import ProfileButton from '@components/reusable/buttons/ProfileButton'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useUser from '@hooks/useUser'
import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'

import '@styles/components/ui/appbar/landingAppBar.css'

export default function LandingAppBar() {
  const { currentUser } = useAuth()
  const { appBarHeight } = useApp()
  const { preferences } = useUser()

  const userTheme = preferences?.theme === 'light' ? 'light' : 'dark'

  useGSAP(() => {
    gsap.from('.nav-item', {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    })
  })

  return (
    <AppBar color='inherit' className='landing-appbar' animate noRotate top>
      <Link href='/' className='flex flex-center nav-item landing-logo__link'>
        <div>
          <img
            className='landing-appbar__logo'
            width='40'
            height='40'
            alt='TaskFlow Logo'
            src={`/taskflow-logo-${userTheme}.svg`}
            fetchPriority='high'
          />
        </div>
        <Typography className='landing-logo__text' component='span'>
          TaskFlow
        </Typography>
      </Link>

      <div className='flex flex-center nav-item landing-appbar__actions'>
        <ThemeUpdater />
        <LangUpdater reloadOnChange />
        {currentUser && (
          <ProfileButton
            onlyIcon
            className='landing-appbar__profile-avatar'
            tooltipPosition='bottom-start'
          />
        )}
      </div>
    </AppBar>
  )
}
