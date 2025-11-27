import db from '@/db'
import i18n from '@/i18n'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export default async function sendWelcomeNotification(user) {
  try {
    const notificationsCol = collection(db, 'users', user, 'notifications')

    await addDoc(notificationsCol, {
      type: 'welcome',
      notificationDate: serverTimestamp(),
      read: false
    })
  } catch (err) {
    throw getFriendlyErrorFormatted(
      'sendWelcomeNotification',
      err.message,
      i18n.language
    )
  }
}
