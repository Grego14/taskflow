import { useEffect, useState, useCallback, useMemo } from 'react'
import NotificationsContext from './context'
import useUser from '@hooks/useUser'
import { notificationService } from '@services/notification'
import { dbAdapter } from '@services/dbAdapter'

export default function NotificationsProvider({ children }) {
  const { uid } = useUser()
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!uid) {
      setNotifications([])
      return
    }

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
        setNotifications(data)
      },
      (err) => {
        console.error('Notification Listener Error:', err)
        setError(err.message)
      }
    )

    return () => unsubscribe()
  }, [uid])

  const onAccept = useCallback(async (e) => {
    const { notificationId, projectOwner, projectId } = e.currentTarget.dataset
    await notificationService.manageInvitation({
      user: uid,
      notification: notificationId,
      action: 'accept',
      projectOwner,
      projectId
    })
  }, [uid])

  const onDecline = useCallback(async (e) => {
    const { notificationId, projectOwner, projectId } = e.currentTarget.dataset
    await notificationService.manageInvitation({
      user: uid,
      notification: notificationId,
      action: 'decline',
      projectOwner,
      projectId
    })
  }, [uid])

  const deleteNotification = useCallback(async (e) => {
    const { notificationId } = e.currentTarget.dataset
    if (notificationId) await notificationService.delete(uid, notificationId)
  }, [uid])

  const value = useMemo(() => ({
    notifications,
    onAccept,
    onDecline,
    deleteNotification,
    error
  }), [notifications, onAccept, onDecline, deleteNotification, error])

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}
