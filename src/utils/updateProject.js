import getFriendlyAuthError from './getFriendlyAuthError.js'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase-config.js'

export default async function updateProject(uid, projectId, data) {
  if (!uid || !projectId)
    throw Error('updateProject: invalid user id or project id!')

  try {
    const projectRef = doc(db, 'users', uid, 'projects', projectId)

    await updateDoc(projectRef, data)
  } catch (e) {
    console.error(e)
    throw getFriendlyAuthError(e.message).message
  }
}
