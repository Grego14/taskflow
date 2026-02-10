import { doc, writeBatch } from 'firebase/firestore'
import db from '@/db'
import i18n from '@/i18n'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'

export default async function markNotificationsAsRead({ user, notifications }) {
  try {
    const batch = writeBatch(db)

    for (const id of notifications) {
      const notificationDoc = doc(db, 'users', user, 'notifications', id)
      batch.update(notificationDoc, { read: true })
    }

    await batch.commit()
  } catch (err) {
    console.error(getFriendlyErrorFormatted('markNotificationsAsRead', err.message, i18n.language))
  }
}
