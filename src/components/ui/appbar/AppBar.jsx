import MUIAppBar from '@mui/material/AppBar'
import { memo } from 'react'

// hooks
import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import { useTheme } from '@mui/material/styles'

const appBarMobileStyles = {
  px: 0,
  py: 1,
  justifyContent: 'space-around',
  top: 'auto',
  bottom: 0,
  left: 0,
  right: 'auto'
}

export default memo(function AppBar({ children, withDrawer, top = false, sx }) {
  const { isMobile, appBarHeight, drawerWidth } = useApp()
  const theme = useTheme()
  const { preferences } = useUser()
  const userTheme = preferences?.theme || 'light'

  const shadowColor = theme.palette.grey[userTheme === 'light' ? 300 : 800]
  const shadow = `0 0 3px ${shadowColor}`

  return (
    <MUIAppBar
      color='inherit'
      variant='outlined'
      elevation={0}
      position={isMobile && !top ? 'fixed' : 'relative'}
      sx={{
        height: appBarHeight,
        transition: 'width .25s ease-out',
        width: !withDrawer ? '100%' : `calc(100% - ${drawerWidth?.closed}px)`,
        ml: !withDrawer ? 0 : 'auto',
        px: 2,
        boxShadow: shadow,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        ...(isMobile && appBarMobileStyles),
        ...sx
      }}>
      {children}
    </MUIAppBar>
  )
})
