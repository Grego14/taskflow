import i18n from '@/i18n'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import {
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  writeBatch
} from 'firebase/firestore'
import db from '@/db'

export default async function sendMembersInvitation({
  project,
  owner,
  members,
  projectName,
  invitedBy
}) {
  if (!project || !owner)
    throw Error('sendMembersInvitation: No project or owner specified!')

  if (members?.length < 1)
    throw Error('sendMembersInvitation: No members to invite!')

  try {
    const projectDoc = doc(db, 'users', owner, 'projects', project)
    const batch = writeBatch(db)

    for (const member of members) {
      const memberNotificationDoc = doc(
        collection(db, 'users', member.id, 'notifications')
      )

      batch.set(memberNotificationDoc, {
        type: 'invitation',
        accepted: false,
        projectName,
        projectOwner: owner,
        projectId: project,
        invitedBy,
        notificationDate: serverTimestamp(),
        read: false,
        declined: false
      })
    }

    // this invitedUsers field is only used inside firestore rules so the user
    // can update the project doc. When the user accepts, his uid will be removed
    batch.update(projectDoc, {
      invitedUsers: arrayUnion(...members.map(member => member.id))
    })

    await batch.commit()
  } catch (err) {
    console.error(err)
    throw getFriendlyErrorFormatted(
      'sendMembersInvitation',
      err.message,
      i18n.language
    )
  }
}
