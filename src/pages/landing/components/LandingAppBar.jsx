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

const appBarStyles = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: 2,
  width: '100%',
  border: 'none',
  position: 'fixed',
  top: 0,
  backgroundColor: 'transparent',
  zIndex: 100
}

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
    <AppBar color='inherit' sx={appBarStyles} animate noRotate top>
      <Link
        href='/'
        className='flex flex-center nav-item'
        color='textPrimary'
        sx={(t) => ({
          ...t.typography.h5,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        })}>
        <Box sx={[theme => ({
          color: theme.palette.common[userTheme === 'light' ? 'white' : 'black']
        })]}>
          <img
            width='40'
            height='40'
            alt='TaskFlow Logo'
            src={`/taskflow-logo-${userTheme}.svg`}
            fetchPriority='high'
          />
        </Box>
        <Typography variant='h6' sx={{ fontWeight: 700 }}>TaskFlow</Typography>
      </Link>

      <Box className='flex flex-center nav-item' sx={{ display: 'flex', gap: 2 }}>
        <ThemeUpdater />
        <LangUpdater reloadOnChange />
        {currentUser && (<ProfileButton
          onlyIcon
          sx={{
            '& .MuiAvatar-root': {
              width: 30,
              height: 30
            }
          }}
          tooltipPosition='bottom-start'
        />)}
      </Box>
    </AppBar>
  )
}
