import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import NavLink from '@components/reusable/NavLink'

import useNotifications from '@hooks/useNotifications'
import useApp from '@hooks/useApp'
import useLayout from '@hooks/useLayout'

import { memo } from 'react'

export default memo(function NavAction({
  link,
  showText,
  onClick,
  noSpace,
  isActive,
  className,
  showTooltip,
  tooltipPlacement = 'top',
  hideText,
  showBg
}) {
  const { isMobile } = useApp()
  const { unreadCount } = useNotifications()
  const { isPreview, triggerUpsell } = useLayout()
  const { icon: Icon, translation, to, isNotifications } = link

  const iconElement = (
    <Badge badgeContent={isNotifications ? unreadCount : 0} color='primary' max={99}>
      <Icon fontSize={noSpace ? 'medium' : 'small'} />
    </Badge>
  )

  const handleInteraction = (e) => {
    if (isPreview) {
      e.preventDefault()
      triggerUpsell('drawer-action')
      return
    }

    onClick?.(e)
  }

  const content = (
    <NavLink
      to={isPreview ? '#' : to}
      onClick={handleInteraction}
      className='flex flex-center nav-action'
      gap={showText ? 1.5 : 0}
      sx={theme => {
        const contrast = theme.palette.primary.contrast
        const isDark = theme.palette.mode === 'dark'

        return {
          color: isDark ? 'action.selected' : 'text.secondary',
          '&:hover': { opacity: 0.75 },
          justifyContent: showText ? 'flex-start' : 'center',
          width: '100%',
          p: noSpace ? 0 : 1.5,
          ...(isActive && {
            color: isDark
              ? '#fff'
              : theme.darken(contrast, 0.1),
            '& .nav-action-text': { fontWeight: 500 },
            backgroundColor: showBg
              ? theme.alpha(theme.palette.primary.main, 0.25)
              : 'transparent'
          }),
          textDecoration: 'none',
          ...(hideText && { justifyContent: 'center' })
        }
      }}>
      <span className='nav-action__icon hide-element'>
        {iconElement}
      </span>
      {showText && (
        <Typography
          className='nav-action__text hide-element'
          variant='body2'
          sx={{
            ...(hideText && {
              position: 'absolute',
              opacity: 0,
              visibility: 'hidden'
            })
          }}>
          {translation}
        </Typography>
      )}
    </NavLink>
  )

  if (isMobile && noSpace || showTooltip) {
    return <Tooltip title={translation} placement={tooltipPlacement}>
      {content}
    </Tooltip>
  }

  return content
})
