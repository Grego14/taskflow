import DropdownMenu from '@components/reusable/DropdownMenu'
import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import AppBar from '@components/ui/appbar/AppBar'
import Slide from '@mui/material/Slide'

import { lazy, Suspense } from 'react'

import Link from '@components/reusable/Link'
import LangUpdater from '@components/ui/buttons/LangUpdater'
import ThemeUpdater from '@components/ui/buttons/ThemeUpdater'

// hooks
import useApp from '@hooks/useApp'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function LandingAppBar({ height, show }) {
  const { isMobile } = useApp()
  const isTablet = useMediaQuery(theme => theme.breakpoints.only('tablet'))
  const theme = useTheme()
  const showMenu = isMobile && !isTablet

  return (
    <Slide in={show}>
      <Box>
        <AppBar
          color='inherit'
          position='fixed'
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: height,
            px: 2
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
      </Box>
    </Slide>
  )
}
