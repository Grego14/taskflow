import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import NotificationsContext from './context.js'

import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'

import lazyImport from '@utils/lazyImport'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'

import db from '@/db'

const getActionMetadata = target => {
  if (!target || !target?.currentTarget || !target.currentTarget?.dataset)
    return

  return target.currentTarget.dataset
}

export default function NotificationsProvider() {
  const { uid } = useUser()
  const [notifications, setNotifications] = useState([])
  const [error, setError] = useState(null)
  const manageProjectInvitation = useRef(null)

  // get and listen for the user notifications
  useEffect(() => {
    let unsubscribe

    if (uid) {
      const notificationsCol = collection(db, 'users', uid, 'notifications')

      unsubscribe = onSnapshot(
        notificationsCol,
        snap => {
          const exists = !snap.empty

          setNotifications(
            exists ? snap.docs.map(doc => ({ ...doc.data(), id: doc.id })) : []
          )
        },
        err => setError(err.message)
      )
    }

    return () => unsubscribe?.()
  }, [uid])

  const onDecline = useCallback(
    e => {
      ; (async () => {
        const { notificationId, projectOwner, projectId } = getActionMetadata(e)

        if (!notificationId || !projectOwner || !projectId) return

        // get the function when needeed
        if (typeof manageProjectInvitation.current !== 'function') {
          manageProjectInvitation.current = await lazyImport(
            '/src/services/manageProjectInvitation'
          )
        }

        await manageProjectInvitation.current({
          notification: notificationId,
          action: 'decline',
          user: uid,
          projectOwner,
          projectId
        })
      })()
    },
    [uid]
  )

  const onAccept = useCallback(
    e => {
      ; (async () => {
        const { notificationId, projectOwner, projectId } = getActionMetadata(e)

        if (!notificationId || !projectOwner || !projectId) return

        // get the function when needeed
        if (typeof manageProjectInvitation.current !== 'function') {
          manageProjectInvitation.current = await lazyImport(
            '/src/services/manageProjectInvitation'
          )
        }

        await manageProjectInvitation.current({
          notification: notificationId,
          action: 'accept',
          user: uid,
          projectOwner,
          projectId
        })
      })()
    },
    [uid]
  )

  const deleteNotification = useCallback(
    e => {
      ; (async () => {
        const { notificationId } = getActionMetadata(e)

        if (!notificationId) return

        await deleteDoc(doc(db, 'users', uid, 'notifications', notificationId))
      })()
    },
    [uid]
  )

  const value = useMemo(
    () => ({
      notifications,
      onAccept,
      onDecline,
      deleteNotification
    }),
    [onAccept, onDecline, deleteNotification, notifications]
  )

  return (
    <NotificationsContext.Provider value={value}>
      <Outlet />
    </NotificationsContext.Provider>
  )
}
