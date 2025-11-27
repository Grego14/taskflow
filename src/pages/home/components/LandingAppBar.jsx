import DropdownMenu from '@components/reusable/DropdownMenu'
import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Slide from '@mui/material/Slide'

import { lazy, Suspense } from 'react'

const AppBar = lazy(() => import('@components/ui/appbar/AppBar'))
const Link = lazy(() => import('@components/reusable/Link'))
const LangUpdater = lazy(() => import('@components/ui/buttons/LangUpdater'))
const ThemeUpdater = lazy(() => import('@components/ui/buttons/ThemeUpdater'))

// hooks
import useApp from '@hooks/useApp'
import { useTheme } from '@mui/material/styles'
import useScrollTrigger from '@mui/material/useScrollTrigger'

export default function LandingAppBar({ height, show }) {
  const { isMobile } = useApp()
  const theme = useTheme()
  const trigger = useScrollTrigger({ disableHysteresis: true })

  return (
    <Slide in={!trigger}>
      <Box>
        {show && (
          <Suspense>
            <AppBar
              top={true}
              color='inherit'
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: height,
                px: 2,
                position: 'fixed',
                ...(isMobile && {
                  top: 0,
                  bottom: 'auto',
                  left: 0,
                  right: 'auto'
                })
              }}>
              <Link
                to='/'
                className='flex flex-center'
                gap={1}
                color='textPrimary'
                sx={[
                  theme => ({ ...theme.typography.h6, textDecoration: 'none' })
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
