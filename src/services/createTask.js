import { db } from '@/firebase/firebase-config.js'
import getFriendlyAuthError from '@utils/getFriendlyAuthError'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'

/**
 * creates a project task
 * @param {string} userId - ID of the user
 * @param {string} projectId - ID of the project
 * @param {string} task - data of the task
 * @throws A getFriendlyAuthError object if the data is not found: {code: string, message: string}
 */
export default async function createTask(userId, projectId, task) {
  try {
    const taskCol = collection(
      db,
      'users',
      userId,
      'projects',
      projectId,
      'tasks'
    )
    const projectRef = doc(db, 'users', userId, 'projects', projectId)

    await addDoc(taskCol, {
      ...task,
      projectId: projectRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  } catch (err) {
    console.error(err)
    throw getFriendlyAuthError(err.message).message
  }
}
