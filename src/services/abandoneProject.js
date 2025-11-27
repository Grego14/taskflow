import db from '@/db'
import i18n from '@/i18n'
import { arrayRemove, doc, updateDoc, writeBatch } from 'firebase/firestore'
import { getFriendlyErrorFormatted } from '../utils/getFriendlyAuthError'

// only non-members can abandone a project... the owner needs to delete it
export default async function abandoneProject(userId, projectId, ownerId) {
  try {
    const batch = writeBatch(db)
    const projectDoc = doc(db, 'users', ownerId, 'projects', projectId)
    const projectDrawerDoc = doc(
      db,
      'users',
      ownerId,
      'projects',
      `${projectId}_drawer`
    )

    batch.update(projectDoc, { members: arrayRemove(userId) })
    batch.update(projectDrawerDoc, { members: arrayRemove(userId) })

    await batch.commit()
  } catch (err) {
    // console.error(err)
    throw getFriendlyErrorFormatted(
      'abandoneProject',
      err.message,
      i18n.language
    )
  }
}
