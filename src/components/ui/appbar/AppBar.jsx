import MUIAppBar from '@mui/material/AppBar'

import useApp from '@hooks/useApp'
import { forwardRef, useRef } from 'preact/compat'
import useLayout from '@hooks/useLayout'
import useAppBarAnimation from '@hooks/animations/useAppBarAnimation'

import { DRAWER_CONFIG, APPBAR_HEIGHT } from '@/constants'

const appBarMobileStyles = {
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
    animate,
    noRotate,
    ...other
  } = props

  const { isMobile } = useApp()
  const appBarRef = useRef(null)
  const height = APPBAR_HEIGHT[isMobile ? 'mobile' : 'other']

  useAppBarAnimation(ref || appBarRef, { enabled: animate, noRotate, top })

  return (
    <MUIAppBar
      ref={ref || appBarRef}
      color='inherit'
      variant='outlined'
      elevation={0}
      position={isMobile && !top ? 'fixed' : 'relative'}
      sx={theme => ({
        height,
        transition: 'width .25s ease-out',
        ...(withDrawer && { borderLeftWidth: 0, borderTopWidth: 0 }),
        px: 2,
        boxShadow: shadow,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        ...(isMobile && appBarMobileStyles),
        ...(typeof sx === 'function' ? sx(theme) : sx)
      })}>
      {children}
    </MUIAppBar>
  )
})

export default AppBar
