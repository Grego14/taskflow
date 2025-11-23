import DropdownMenu from '@components/reusable/DropdownMenu'
import HideOnScroll from '@components/reusable/HideOnScroll'
import LoginButton from '@components/reusable/buttons/LoginButton'
import SignUpButton from '@components/reusable/buttons/SignUpButton'
import MenuIcon from '@mui/icons-material/Menu'
import MuiAppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { Link } from 'react-router-dom'

// hooks
import useApp from '@hooks/useApp'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function AppBar({ height }) {
  const { isMobile } = useApp()
  const isTablet = useMediaQuery(theme => theme.breakpoints.only('tablet'))
  const theme = useTheme()
  const showMenu = isMobile && !isTablet

  return (
    <HideOnScroll threshold={225} hysteresis>
      <MuiAppBar
        color='inherit'
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: height,
          px: 2
        }}>
        <Link to='/'>
          <img
            src='/images/taskflow_logo.png'
            alt='TaskFlow'
            width={150}
            fetchPriority='high'
          />
        </Link>

        {isMobile && !isTablet ? (
          <DropdownMenu
            icon={<MenuIcon fontSize='medium' />}
            slotProps={{
              list: {
                sx: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }
              }
            }}>
            <LoginButton
              sx={{
                borderRadius: 0,
                ...theme.typography.button,
                textTransform: 'none'
              }}
            />
            <SignUpButton
              variant='text'
              sx={{
                borderRadius: 0,
                ...theme.typography.button,
                textTransform: 'none'
              }}
            />
          </DropdownMenu>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <LoginButton />
            <Divider aria-hidden='true' orientation='vertical' flexItem />
            <SignUpButton />
          </Box>
        )}
      </MuiAppBar>
    </HideOnScroll>
  )
}
