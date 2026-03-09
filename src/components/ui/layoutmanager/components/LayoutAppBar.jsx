import { memo, useRef, useCallback } from 'react'

import AppBar from '@components/ui/appbar/AppBar'
import Box from '@mui/material/Box'
import NavAction from '@components/reusable/NavAction'
import ProfileButton from '@components/reusable/buttons/ProfileButton'

import { useTranslation } from 'react-i18next'
import useApp from '@hooks/useApp'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useGSAP } from '@gsap/react'
import useLoadResources from '@hooks/useLoadResources'
import { useLocation } from 'react-router-dom'

import { NAV_LINKS } from '@constants/navigation'
import gsap from 'gsap'

const LayoutAppBar = memo(function LayoutAppBar() {
  const { t } = useTranslation('ui')
  const { isMobile } = useApp()
  const noSpace = useMediaQuery('(max-width: 35rem)')
  const appBarRef = useRef(null)
  const loadingResources = useLoadResources('ui')

  const { pathname } = useLocation()

  const { contextSafe } = useGSAP({ scope: appBarRef })

  const handleLinkClick = useCallback(contextSafe((e) => {
    if (!noSpace) return

    gsap.to('.appbar-link', { scale: 1, overwrite: true })
    gsap.to(e.currentTarget, { scale: 1.25, duration: 0.3, overwrite: true })
  }), [noSpace])

  if (!isMobile || loadingResources) return null

  const items = []
  for (const link of NAV_LINKS) {
    items.push(
      <NavAction
        key={link.key}
        noSpace={noSpace}
        showText={!noSpace}
        link={{ ...link, translation: t(link.translation) }}
        onClick={handleLinkClick}
        className='appbar-link'
        isActive={pathname === link.to}
      />
    )
  }

  return (
    <AppBar
      animate
      noRotate={!noSpace}
      ref={appBarRef}
      sx={theme => ({
        justifyContent: noSpace ? 'space-around' : 'space-between',
        ml: 'auto',
        backgroundColor: theme.palette.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.25)'
          : 'rgba(255,255,255, 0.5)',
        backgroundImage: theme.palette.background.appbar[isMobile ? 'bottom' : 'top'],
        perspective: '1000px',
        transformOrigin: '0 50% -50',
      })}>
      {noSpace ? items : <Box className='flex' gap={1}>{items}</Box>}

      <ProfileButton open onlyIcon sx={{ ml: 1.5 }} />
    </AppBar>
  )
})

export default LayoutAppBar
