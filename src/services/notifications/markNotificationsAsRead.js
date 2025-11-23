import dbManipulationWrapper from '@utils/dbManipulationWrapper'
import { doc, writeBatch } from 'firebase/firestore'

export default function markNotificationsAsRead({ user, notifications }) {
  const markNotificationsAsRead = async db => {
    const batch = writeBatch(db)

    for (const id of notifications) {
      const notificationDoc = doc(db, 'users', user, 'notifications', id)
      batch.update(notificationDoc, { read: true })
    }

    await batch.commit()
  }

  dbManipulationWrapper('markNotificationsAsRead', db =>
    markNotificationsAsRead(db)
  )
}
