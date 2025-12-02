import Box from '@mui/material/Box'
import Slide from '@mui/material/Slide'

import { Suspense, lazy } from 'react'

const AppBar = lazy(() => import('@components/ui/appbar/AppBar'))
const Link = lazy(() => import('@mui/material/Link'))
const LangUpdater = lazy(() => import('@components/ui/buttons/LangUpdater'))
const ThemeUpdater = lazy(() => import('@components/ui/buttons/ThemeUpdater'))

// hooks
import useApp from '@hooks/useApp'
import useScrollTrigger from '@mui/material/useScrollTrigger'

export default function LandingAppBar({ show }) {
  const { appBarHeight } = useApp()
  const trigger = useScrollTrigger({ disableHysteresis: true })

  return (
    <Slide in={!trigger}>
      <Box
        sx={[
          theme => ({
            width: '100%',
            zIndex: theme.zIndex.appBar,
            top: 0,
            left: 0,
            bottom: 'auto',
            right: 'auto',
            position: 'fixed',
            minHeight: appBarHeight
          })
        ]}>
        {show && (
          <Suspense>
            <AppBar
              top={true}
              color='inherit'
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                px: 2
              }}>
              <Link
                href='/'
                className='flex flex-center'
                gap={1}
                color='textPrimary'
                sx={[
                  theme => ({ ...theme.typography.h5, textDecoration: 'none' })
                ]}>
                TaskFlow
              </Link>
              <Box className='flex flex-center' gap={2}>
                <ThemeUpdater />
                <LangUpdater reloadOnChange />
              </Box>
            </AppBar>
          </Suspense>
        )}
      </Box>
    </Slide>
  )
}
