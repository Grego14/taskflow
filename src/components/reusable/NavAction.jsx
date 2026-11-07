import NavLink from '@components/reusable/NavLink'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import AppTooltip from './AppTooltip'

import useApp from '@hooks/useApp'
import useLayout from '@hooks/useLayout'
import useNotifications from '@hooks/useNotifications'

import { memo, useMemo, useCallback } from 'preact/compat'

import '@styles/components/buttons/nav-action.css'

export default memo(function NavAction({
  link,
  showText,
  onClick,
  isActive,
  showTooltip,
  tooltipPlacement = 'top',
  hideText,
  showBg,
  className
}) {
  const { isMobile, isOnlyMobile } = useApp()
  const { unreadCount } = useNotifications()
  const { isPreview, triggerUpsell } = useLayout()
  const { icon: Icon, translation, to, isNotifications } = link

  const iconElement = useMemo(
    () => (
      <Badge
        badgeContent={isNotifications ? unreadCount : 0}
        color='primary'
        max={99}>
        <Icon className='nav-action__badge-icon' />
      </Badge>
    ),
    [Icon, isNotifications, unreadCount]
  )

  const handleInteraction = useCallback(
    e => {
      if (isPreview) {
        e.preventDefault()
        triggerUpsell('drawer-action')
        return
      }

      onClick?.(e)
    },
    [triggerUpsell, onClick, isPreview]
  )

  const dynamicVars = useMemo(() => {
    const primary = 'var(--mui-palette-primary-main)'
    const activeBg = showBg
      ? 'rgba(var(--mui-palette-primary-mainChannel) / 0.25)'
      : 'transparent'

    return {
      '--active-bg-mobile': isMobile ? activeBg : 'transparent',
      '--active-border-mobile':
        isActive && showBg && isMobile ? primary : 'transparent',
      '--active-shadow-mobile':
        isActive && showBg && isMobile ? 'var(--mui-shadows-3)' : 'none'
    }
  }, [isActive, showBg, isMobile])

  const linkClass = `nav-action relative flex
  ${className || ''} ${isActive ? '--active' : ''}`

  const content = useMemo(
    () => (
      <NavLink to={to} onClick={handleInteraction} className={linkClass}>
        <span className='nav-action__icon flex relative'>{iconElement}</span>
        {showText && (
          <Typography
            className={`nav-action__text hide-element 
            ${hideText ? 'is-hidden' : ''}`}
            variant='body2'>
            {translation}
          </Typography>
        )}
      </NavLink>
    ),
    [
      to,
      translation,
      hideText,
      showText,
      linkClass,
      iconElement,
      handleInteraction
    ]
  )

  if (isMobile || showTooltip) {
    return (
      <AppTooltip title={translation} placement={tooltipPlacement}>
        {content}
      </AppTooltip>
    )
  }

  return content
})
