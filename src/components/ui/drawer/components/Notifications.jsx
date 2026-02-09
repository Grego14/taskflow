import { Suspense, lazy, useState } from 'react'

import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import DrawerAction from './DrawerAction'

const Menu = lazy(() => import('@mui/material/Menu'))
const InvitationNotification = lazy(
  () => import('@components/ui/notifications/InvitationNotification')
)
const WelcomeNotification = lazy(
  () => import('@components/ui/notifications/WelcomeNotification')
)
const KickedNotification = lazy(
  () => import('@components/ui/notifications/KickedNotification')
)

import useNotifications from '@hooks/useNotifications'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import formatTimestamp from '@utils/formatTimestamp'
import lazyImport from '@utils/lazyImport'

const isWelcome = notification => notification?.type === 'welcome'

export default function Notifications({ open: drawerOpen, toggleDrawer }) {
  const { uid } = useUser()
  const { t } = useTranslation('ui')

  const { notifications } = useNotifications()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const newNotifications =
    notifications?.filter(notification => !notification.read) || []

  const handleOnClose = async () => {
    setAnchorEl(null)

    if (newNotifications?.length > 0) {
      const markNotificationsAsRead = await lazyImport(
        '/src/services/notifications/markNotificationsAsRead'
      )
      await markNotificationsAsRead({
        user: uid,
        notifications:
          newNotifications?.map(notification => notification.id) || []
      })
    }
  }

  return (
    <>
      <DrawerAction
        open={drawerOpen}
        icon={
          <Badge
            badgeContent={newNotifications.length}
            color='primary'
            max={99}>
            <NotificationsIcon fontSize='small' />
          </Badge>
        }
        text={t('drawer.notifications')}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        showText
        id='notifications-button'
        aria-controls={'notifications-menu'}
        aria-haspopup='true'
        aria-expanded={open}
      />

      <Suspense fallback={null}>
        <Menu
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={open}
          anchorEl={anchorEl}
          onClose={handleOnClose}
          aria-labelledby='notifications-button'
          id='notifications-menu'>
          <Suspense fallback={null}>
            {notifications
              ?.sort((a, b) => {
                const aDate =
                  formatTimestamp(a.notificationDate)?.raw || new Date()
                const bDate =
                  formatTimestamp(b.notificationDate)?.raw || new Date()

                return aDate > bDate ? 0 : 1
              })
              .map(notification => {
                if (notification.type === 'welcome') {
                  return (
                    <WelcomeNotification
                      key={notification.id}
                      data={notification}
                    />
                  )
                }

                if (notification.type === 'kicked') {
                  return (
                    <KickedNotification
                      key={notification.id}
                      data={notification}
                      closeMenu={() => setAnchorEl(null)}
                    />
                  )
                }

                if (notification.type === 'invitation') {
                  return (
                    <InvitationNotification
                      key={notification.id}
                      data={notification}
                      closeMenu={() => setAnchorEl(null)}
                    />
                  )
                }
              })}
          </Suspense>

          {notifications?.length === 0 && (
            <Typography px={2} color='textSecondary'>
              {t('notifications.empty')}
            </Typography>
          )}
        </Menu>
      </Suspense>
    </>
  )
}
