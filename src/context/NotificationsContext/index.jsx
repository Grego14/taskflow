import NotificationsContext from './context'

import { useEffect, useState, useCallback, useMemo } from 'react'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import notificationService from '@services/notification'
import { dbAdapter } from '@services/dbAdapter'

import playSound from '@services/audio'
import flashTitle from '@utils/notifications/titleNotification'

export default function NotificationsProvider({ children }) {
  const { t } = useTranslation('ui')
  const { uid } = useUser()
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) {
      setNotifications([])
      return
    }

    setLoading(true)
    const query = notificationService.getNotificationsQuery(uid)

    const unsubscribe = dbAdapter.listen(
      query,
      (snap) => {
        const data = []

        for (const doc of snap.docs) {
          data.push({
            ...doc.data(),
            id: doc.id
          })
        }

        if (!snap.metadata.hasPendingWrites) {
          for (const change of snap.docChanges()) {
            if (change.type === 'added') {
              const newNotif = change.doc.data()
              // check if the notification was created in less than 10 seconds
              const isRecent = (Date.now() - (newNotif.createdAt || 0)) < 10000

              // play the sound only if the task is new and is not readed
              if (!newNotif.read && isRecent) {
                playSound('notification')

                if (document.hidden) {
                  const alertMsg = t('notifications.new')
                  flashTitle(`🔴 ${alertMsg}`)
                }
              }
            }
          }
        }

        setNotifications(data)
        setLoading(false)
      },
      (err) => {
        console.error('Notification Listener Error:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [uid])

  const onAccept = useCallback(async (e) => {
    const { id, projectOwner, projectId } = data
    await notificationService.manageInvitation({
      user: uid,
      notification: id,
      action: 'accept',
      projectOwner,
      projectId
    })
  }, [uid])

  const onDecline = useCallback(async (data) => {
    const { id, projectOwner, projectId } = data
    await notificationService.manageInvitation({
      user: uid,
      notification: id,
      action: 'decline',
      projectOwner,
      projectId
    })
  }, [uid])

  const deleteNotification = useCallback(async (id) => {
    await notificationService.delete(uid, id)
  }, [uid])

  const markNotificationsAsRead = useCallback(async (ids) => {
    if (!uid || !ids.length) return
    await notificationService.markAsRead(uid, ids)
  }, [uid])

  const unreadCount = notifications.filter(notif => notif.read === false).length

  const value = useMemo(() => ({
    notifications,
    onAccept,
    onDecline,
    deleteNotification,
    markNotificationsAsRead,
    error,
    loading,
    unreadCount
  }), [notifications,
    onAccept,
    onDecline,
    deleteNotification,
    error,
    loading,
    markNotificationsAsRead, unreadCount]
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}
