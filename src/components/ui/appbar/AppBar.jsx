import MUIAppBar from '@mui/material/AppBar'

import useApp from '@hooks/useApp'
import { forwardRef, useRef } from 'preact/compat'
import useLayout from '@hooks/useLayout'
import useAppBarAnimation from '@hooks/animations/useAppBarAnimation'

import { APPBAR_HEIGHT } from '@/constants'

import '@styles/components/ui/appbar/appBar.css'

const AppBar = forwardRef((props, ref) => {
  const {
    children,
    withDrawer,
    top = false,
    shadow,
    animate,
    noRotate,
    animateY = false,
    noTexts = false,
    className,
    style
  } = props

  const { isMobile } = useApp()
  const appBarRef = useRef(null)
  const height = APPBAR_HEIGHT[isMobile ? 'mobile' : 'other']

  useAppBarAnimation(ref || appBarRef, {
    enabled: animate,
    noRotate,
    top,
    animateY,
    // bar doesn't contain texts so we don't try to animate them (avoid 
    // gsap warning)
    noTexts 
  })

  const classNames = [
    'app-bar flex',
    isMobile ? 'app-bar--mobile' : '',
    top ? 'app-bar--top' : '',
    withDrawer ? 'app-bar--with-drawer' : '',
    className
  ].filter(Boolean).join(' ')

  const translateFrom = `${top ? '-' : ''}${height}`

  return (
    <MUIAppBar
      ref={ref || appBarRef}
      color='inherit'
      variant='outlined'
      elevation={0}
      className={classNames}
      style={{ 
        '--appbar-shadow': shadow,
        '--appbar-translate-from': translateFrom,
        ...style
      }}>
      {children}
    </MUIAppBar>
  )
})

export default AppBar
