import { memo, useRef, useMemo } from 'preact/compat'

import AppBar from '@components/ui/appbar/AppBar'
import Box from '@mui/material/Box'
import NavAction from '@components/reusable/NavAction'
import ProfileButton from '@components/reusable/buttons/ProfileButton'

import { useTranslation } from 'react-i18next'
import useApp from '@hooks/useApp'
import { useGSAP } from '@gsap/react'
import useLoadResources from '@hooks/useLoadResources'
import { useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

import { NAV_LINKS } from '@constants/navigation'
import { BREAKPOINTS } from '@/theme'
import gsap from 'gsap'

import '@styles/components/ui/appbar/layoutAppBar.css'

const LayoutAppBar = memo(function LayoutAppBar() {
  const { t } = useTranslation('ui')
  const { isMobile } = useApp()
  const theme = useTheme()
  const appBarRef = useRef(null)
  const { pathname } = useLocation()

  const loadingResources = useLoadResources('ui')
  const { contextSafe } = useGSAP({ scope: appBarRef })

  const handleLinkClick = contextSafe((e) => {
    if (window.innerWidth > BREAKPOINTS.tablet) return

    const tl = gsap.timeline()

    tl.to('.nav-action', {
      scale: 1, 
      rotate: 0,
      y: 0,
      duration: 0.4, 
      ease: 'power2.out'
    }).fromTo(e.currentTarget, 
        { scale: 0.75, rotate: -20 },
        { 
          scale: 1.1, 
          rotate: 0,
          ease: 'elastic.out(1.5, 0.5)'
        }, '<0.1')
  })

  const dynamicStyles = useMemo(() => {
    const isDark = theme.palette.mode === 'dark'
    const bgColor = isDark ? theme.palette.grey[900] : theme.palette.grey[100]

    return {
      '--layout-ab-bg': theme.alpha(bgColor, 0.8),
      '--layout-ab-img': theme.palette.background[isMobile 
        ? 'appbarBottom' 
        : 'appbarTop']
    }
  }, [theme.palette.mode, isMobile])

  if (!isMobile || loadingResources) return null

  return (
    <AppBar
      animate
      ref={appBarRef}
      className='layout-appbar'
      style={dynamicStyles}>
      <Box className='layout-ab-container flex'>
        {NAV_LINKS.map(link => (
          <NavAction
            key={link.key}
            link={{ ...link, translation: t(link.translation) }}
            onClick={handleLinkClick}
            isActive={pathname === link.to}
            showBg
          />
        ))}
        <ProfileButton open onlyIcon />
      </Box>
    </AppBar>
  )
})

export default LayoutAppBar
