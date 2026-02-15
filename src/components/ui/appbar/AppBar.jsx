import MUIAppBar from '@mui/material/AppBar'

// hooks
import useApp from '@hooks/useApp'
import { forwardRef } from 'react'

const appBarMobileStyles = {
  px: 0,
  py: 1,
  justifyContent: 'space-around',
  top: 'auto',
  bottom: 0,
  left: 0,
  right: 'auto'
}

const AppBar = forwardRef((props, ref) => {
  const {
    children,
    withDrawer,
    top = false,
    sx,
    shadow,
    ...other
  } = props

  const { isMobile, appBarHeight, drawerWidth } = useApp()

  return (
    <MUIAppBar
      ref={ref}
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

export default AppBar
