import Typography from '@mui/material/Typography'
import LogoLoader from '@components/reusable/loaders/LogoLoader'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import NotificationItem from './NotificationItem'

import useNotifications from '@hooks/useNotifications'
import useLoadResources from '@hooks/useLoadResources'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import { useEffect } from 'preact/hooks'

import gsap from 'gsap'

export default function Notifications() {
  const { t } = useTranslation('notifications')
  const {
    notifications,
    loading,
    onAccept,
    onDecline,
    deleteNotification,
    markNotificationsAsRead
  } = useNotifications()
  const loadingResources = useLoadResources('notifications')

  const { contextSafe } = useGSAP()

  // mark as read when data is ready
  useEffect(() => {
    const isDataReady = !loading && !loadingResources && notifications.length > 0

    if (isDataReady) {
      const unreadIds = []
      for (const n of notifications) {
        if (!n.read) unreadIds.push(n.id)
      }

      if (unreadIds.length > 0) {
        markNotificationsAsRead(unreadIds)
      }
    }
  }, [loading, loadingResources, notifications, markNotificationsAsRead])

  // entry animation
  useGSAP(() => {
    if (!loading && !loadingResources && notifications.length > 0) {
      gsap.from('.notification-card', {
        x: -20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'back.out(1.2)'
      })
    }
  }, [loading, loadingResources])

  // exit animation
  const handleDelete = contextSafe((id) => {
    gsap.to(`#notif-${id}`, {
      opacity: 0,
      x: 50,
      height: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        // fake event-like object because the Provider expects it
        deleteNotification({ currentTarget: { dataset: { notificationId: id } } })
      }
    })
  })

  if (loadingResources || loading) return <LogoLoader />

  const items = []
  if (notifications.length > 0) {
    for (const notif of notifications) {
      items.push(
        <NotificationItem
          key={notif.id}
          notification={notif}
          onAccept={onAccept}
          onDecline={onDecline}
          onDelete={handleDelete}
        />
      )
    }
  }

  return (
    <Container maxWidth='sm' sx={{ py: 6, minHeight: '100vh' }}>
      <Typography
        className='text-center'
        variant='h4'
        sx={{
          mb: 5,
          fontWeight: 900,
          letterSpacing: '-0.5px'
        }}>
        {t('title')}
      </Typography>

      {notifications.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 12, opacity: 0.4 }}>
          <Typography variant='body1'>{t('empty')}</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {items}
        </Box>
      )}
    </Container>
  )
}
