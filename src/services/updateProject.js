import { doc, updateDoc, writeBatch } from 'firebase/firestore'
import { getFriendlyAuthError } from '../utils/getFriendlyAuthError'
import db from '@/db'

export default async function updateProject(uid, projectId, data = {}) {
  if (!uid || typeof uid !== 'string')
    throw Error('updateProject error: uid must be a string!')

  if (!projectId || typeof projectId !== 'string')
    throw Error('updateProject error: projectId must be a string!')

  if (Object.keys(data).length < 1)
    throw Error("updateProject error: data can't be empty!")

  if (data.owner)
    throw Error("updateProject error: Project owner can't be changed (for now)")

  if (data.createdAt)
    throw Error("updateProject error: Project creation date can't be changed!")

  try {
    const projectDoc = doc(db, 'users', uid, 'projects', projectId)
    const batch = writeBatch(db)

    // projectDrawer and project members should be the same
    if (data.members) {
      const projectDrawerDoc = doc(
        db,
        'users',
        uid,
        'projects',
        `${projectId}_drawer`
      )
      batch.update(projectDrawerDoc, { members: data.members })
    }

    batch.update(projectDoc, data)

    await batch.commit()
  } catch (e) {
    console.error(e)
    throw getFriendlyAuthError(e.message).message
  }
}
