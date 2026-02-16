import { useEffect, useState, useCallback, useMemo } from 'react'
import NotificationsContext from './context'
import useUser from '@hooks/useUser'
import { notificationService } from '@services/notification'
import { dbAdapter } from '@services/dbAdapter'

export default function NotificationsProvider({ children }) {
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

  const markNotificationsAsRead = useCallback(async (ids) => {
    if (!uid || !ids.length) return
    await notificationService.markAsRead(uid, ids)
  }, [uid])

  const value = useMemo(() => ({
    notifications,
    onAccept,
    onDecline,
    deleteNotification,
    markNotificationsAsRead,
    error,
    loading
  }), [notifications,
    onAccept,
    onDecline,
    deleteNotification,
    error,
    loading,
    markNotificationsAsRead]
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}
