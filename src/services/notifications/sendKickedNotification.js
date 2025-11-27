import i18n from '@/i18n'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import db from '@/db'

export default async function sendKickedNotification(
  user,
  kickedBy,
  projectName
) {
  try {
    const notificationsCol = collection(db, 'users', user, 'notifications')

    await addDoc(notificationsCol, {
      type: 'kicked',
      notificationDate: serverTimestamp(),
      read: false,
      kickedBy,
      projectName
    })
  } catch (err) {
    throw getFriendlyErrorFormatted(
      'sendWelcomeNotification',
      err.message,
      i18n.language
    )
  }
}
