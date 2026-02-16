import { Suspense, lazy, memo, useRef, useCallback } from 'react'

import AppBar from '@components/ui/appbar/AppBar'
import Box from '@mui/material/Box'
import NavAction from '@components/reusable/NavAction'
const ProfileButton = lazy(
  () => import('@components/reusable/buttons/ProfileButton')
)

import { useTranslation } from 'react-i18next'
import useApp from '@hooks/useApp'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useGSAP } from '@gsap/react'
import useLoadResources from '@hooks/useLoadResources'

import { NAV_LINKS } from '@constants/navigation'
import gsap from 'gsap'

const LayoutAppBar = memo(function LayoutAppBar() {
  const { t } = useTranslation('ui')
  const { isMobile, drawerWidth } = useApp()
  const noSpace = useMediaQuery('(max-width: 35rem)')
  const appBarRef = useRef(null)
  const loadingResources = useLoadResources('ui')

  const { contextSafe } = useGSAP({ scope: appBarRef })

  const handleLinkClick = useCallback(contextSafe((e) => {
    if (!noSpace) return

    gsap.to('.appbar-link', { scale: 1, overwrite: true })
    gsap.to(e.currentTarget, { scale: 1.25, duration: 0.3, overwrite: true })
  }), [noSpace])

  useGSAP(() => {
    if (!isMobile || !appBarRef.current || loadingResources) return

    gsap.set(appBarRef.current, { y: 100 })

    // same as the drawer (no custom ease and duration)
    gsap.to(appBarRef.current, { autoAlpha: 1, y: 0 })
  }, [isMobile, loadingResources])

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
      />
    )
  }

  return (
    <AppBar
      ref={appBarRef}
      sx={{
        justifyContent: noSpace ? 'space-around' : 'space-between',
        px: 2,
        width: `calc(100% - ${drawerWidth?.closed}px)`,
        ml: 'auto',
        opacity: 0,
        visibility: 'hidden',
      }}>
      {noSpace ? items : <Box className='flex' gap={1}>{items}</Box>}

      <Suspense fallback={null}>
        <ProfileButton open onlyIcon />
      </Suspense>
    </AppBar>
  )
})

export default LayoutAppBar
