import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import NavLink from '@components/reusable/NavLink'

import useNotifications from '@hooks/useNotifications'
import useApp from '@hooks/useApp'

import { memo } from 'react'

export default memo(function NavAction({ link, showText, onClick, noSpace }) {
  const { isMobile } = useApp()
  const { unreadCount } = useNotifications()
  const { icon: Icon, translation, to, isNotifications } = link

  const iconElement = (
    <Badge badgeContent={isNotifications ? unreadCount : 0} color='primary' max={99}>
      <Icon fontSize={noSpace ? 'medium' : 'small'} />
    </Badge>
  )

  const content = (
    <NavLink
      to={to}
      onClick={onClick}
      className={`${isMobile ? 'appbar-link' : 'drawer-action'} flex`}
      gap={showText ? 1.5 : 0}
      sx={{
        color: 'text.secondary',
        '&.active': { color: 'primary.main' },
        justifyContent: showText ? 'flex-start' : 'center',
        width: '100%',
        p: noSpace ? 0 : 1.5
      }}
    >
      {iconElement}
      {showText && (
        <Typography className='nav-action-text' variant='body2'>{translation}</Typography>
      )}
    </NavLink>
  )

  if (isMobile && noSpace) {
    return <Tooltip title={translation}>{content}</Tooltip>
  }

  return content
})
