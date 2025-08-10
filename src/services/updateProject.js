import getFriendlyAuthError from '../utils/getFriendlyAuthError'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase-config.js'

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
    const projectRef = doc(db, 'users', uid, 'projects', projectId)

    await updateDoc(projectRef, data)
  } catch (e) {
    console.error(e)
    throw getFriendlyAuthError(e.message).message
  }
}
