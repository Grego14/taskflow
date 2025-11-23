import { Suspense, lazy, useEffect, useState } from 'react'

import NavLink from '@components/reusable/NavLink'
import AppBar from '@components/ui/appbar/AppBar'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import ArticleIcon from '@mui/icons-material/Article'
import FolderOpen from '@mui/icons-material/FolderOpen'
import NotificationsIcon from '@mui/icons-material/Notifications'

const ProfileButton = lazy(
  () => import('@components/reusable/buttons/ProfileButton')
)

import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import useMediaQuery from '@mui/material/useMediaQuery'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export default memo(function LayoutAppBar({ projectId }) {
  const { t } = useTranslation('ui')
  const { uid } = useUser()
  const { drawerWidth, isMobile, isOnlyMobile } = useApp()

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const links = useMemo(
    () => [
      <AppBarLink
        key='appBarLink-templates'
        text={t('drawer.templates')}
        icon={<ArticleIcon fontSize={isOnlyMobile ? 'large' : 'small'} />}
        to='/templates'
        isOnlyMobile={isOnlyMobile}
      />,
      <AppBarLink
        key='appBarLink-projects'
        text={t('projects.text')}
        icon={<FolderOpen fontSize={isOnlyMobile ? 'large' : 'small'} />}
        to='/projects'
        isOnlyMobile={isOnlyMobile}
      />,
      <AppBarLink
        key='appBarLink-notifications'
        text={t('drawer.notifications')}
        icon={<NotificationsIcon fontSize={isOnlyMobile ? 'large' : 'small'} />}
        to='/notifications'
        isOnlyMobile={isOnlyMobile}
      />
    ],
    [isOnlyMobile, t]
  )

  const profileBtn = useMemo(
    () => <ProfileButton open onlyIcon projectId={projectId} />,
    [projectId]
  )

  // hide the links on laptop/desktop
  if (!isMobile) return null

  const layout = (() => {
    if (isOnlyMobile) {
      return (
        <>
          {...links}
          {profileBtn}
        </>
      )
    }

    return (
      <>
        <Box className='flex' gap={2}>
          {...links}
        </Box>
        {profileBtn}
      </>
    )
  })()

  return (
    <AppBar
      sx={{
        justifyContent: `space-${isOnlyMobile ? 'around' : 'between'}`,
        px: 2,
        width: `calc(100% - ${drawerWidth?.closed}px)`,
        ml: 'auto'
      }}>
      {layout}
    </AppBar>
  )
})

function AppBarLink({ icon, text, to, isOnlyMobile }) {
  return (
    // removes the tooltip when the text exists
    <Tooltip title={isOnlyMobile ? text : ''}>
      <NavLink
        to={to}
        color='textSecondary'
        className='flex'
        sx={[
          theme => ({
            '&.active': {
              color: theme.palette.primary.main
            }
          })
        ]}
        gap={!isOnlyMobile ? 1 : 0}>
        {icon}
        {!isOnlyMobile && <Typography variant='body2'>{text}</Typography>}
      </NavLink>
    </Tooltip>
  )
}
