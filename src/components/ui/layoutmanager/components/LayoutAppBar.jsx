import { Suspense, lazy, memo, useMemo, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import useApp from '@hooks/useApp'

import NavLink from '@components/reusable/NavLink'
import AppBar from '@components/ui/appbar/AppBar'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import HouseIcon from '@mui/icons-material/House'
import ArticleIcon from '@mui/icons-material/Article'
import FolderOpen from '@mui/icons-material/FolderOpen'
import NotificationsIcon from '@mui/icons-material/Notifications'

const ProfileButton = lazy(
  () => import('@components/reusable/buttons/ProfileButton')
)

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import useMediaQuery from '@mui/material/useMediaQuery'

const linksData = [
  { key: 'home', translationKey: 'drawer.home', icon: HouseIcon, to: '/home' },
  { key: 'templates', translationKey: 'drawer.templates', icon: ArticleIcon, to: '/templates' },
  { key: 'projects', translationKey: 'projects.text', icon: FolderOpen, to: '/projects' },
  { key: 'notifications', translationKey: 'drawer.notifications', icon: NotificationsIcon, to: '/notifications' }
]

const LayoutAppBar = memo(function LayoutAppBar() {
  const { t } = useTranslation('ui')
  const { drawerWidth, isMobile } = useApp()

  const noSpace = useMediaQuery('(max-width: 30rem)')
  const appBarRef = useRef(null)

  const { contextSafe } = useGSAP({ scope: appBarRef })

  const handleLinkClick = useCallback(contextSafe((e) => {
    if (!noSpace) return

    const tl = gsap.timeline()
    tl.to('.appbar-link', { scale: 1, overwrite: true })
      .to(e.currentTarget, { scale: 1.25, duration: 0.3, overwrite: true }, '-=0.5')
  }), [noSpace, contextSafe])

  const renderedLinks = useMemo(() => {
    const iconSize = noSpace ? 'large' : 'small'

    return linksData.map(link => (
      <AppBarLink
        key={link.key}
        text={t(link.translationKey)}
        icon={<link.icon fontSize={iconSize} />}
        to={link.to}
        noSpace={noSpace}
        handleClick={handleLinkClick}
      />
    ))
  }, [t, noSpace, handleLinkClick])

  useGSAP(() => {
    if (!isMobile || !appBarRef.current) return

    gsap.set(appBarRef.current, { y: 100 })

    // same as the drawer (no custom ease and duration)
    gsap.to(appBarRef.current, { autoAlpha: 1, y: 0 })
  }, [isMobile])

  if (!isMobile) return null

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
      {!noSpace ? (
        <Box className='flex' gap={2}>
          {renderedLinks}
        </Box>
      ) : (
        renderedLinks
      )}

      <Suspense fallback={null}>
        <ProfileButton open onlyIcon />
      </Suspense>
    </AppBar>
  )
})

export default LayoutAppBar

function AppBarLink({ icon, text, to, noSpace, handleClick }) {
  return (
    <Box>
      <Tooltip title={noSpace ? text : ''}>
        <NavLink
          onClick={handleClick}
          to={to}
          color='textSecondary'
          className='flex appbar-link'
          gap={!noSpace ? 1 : 0}
          sx={{
            '&.active': {
              color: 'primary.main'
            }
          }}>
          {icon}
          {!noSpace && <Typography variant='body2'>{text}</Typography>}
        </NavLink>
      </Tooltip>
    </Box>
  )
}
