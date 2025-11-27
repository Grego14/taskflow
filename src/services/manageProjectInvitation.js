import db from '@/db'
import i18n from '@/i18n'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import { arrayRemove, arrayUnion, doc, writeBatch } from 'firebase/firestore'

export default async function manageProjectInvitation({
  user,
  notification,
  action,
  projectOwner,
  projectId
}) {
  try {
    const batch = writeBatch(db)
    const notificationDoc = doc(
      db,
      'users',
      user,
      'notifications',
      notification
    )

    const projectDoc = doc(db, 'users', projectOwner, 'projects', projectId)

    const accepted = action === 'accept'

    batch.update(notificationDoc, {
      accepted,
      read: true,
      declined: action === 'decline'
    })

    if (action === 'accept') {
      const projectDrawerDoc = doc(
        db,
        'users',
        projectOwner,
        'projects',
        `${projectId}_drawer`
      )

      batch.update(projectDoc, {
        members: arrayUnion(user)
      })
      batch.update(projectDrawerDoc, {
        members: arrayUnion(user)
      })

      console.log(projectDrawerDoc.path)
    }

    batch.update(projectDoc, {
      invitedUsers: arrayRemove(user)
    })

    await batch.commit()
  } catch (err) {
    console.error(err)
    throw getFriendlyErrorFormatted(
      'manageProjectInvitation',
      err.message,
      i18n.language
    )
  }
}
