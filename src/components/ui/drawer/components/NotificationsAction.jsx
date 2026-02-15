import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import DrawerAction from './DrawerAction'

import useNotifications from '@hooks/useNotifications'

export default function Notifications({ ...actionProps }) {
  const { notifications } = useNotifications()
  const newNotifications =
    notifications?.filter(notification => !notification.read) || []

  return (
    <DrawerAction
      {...actionProps}
      icon={
        <Badge
          badgeContent={newNotifications.length}
          color='primary'
          max={99}>
          <NotificationsIcon fontSize='small' />
        </Badge>
      }
    />
  )
}
