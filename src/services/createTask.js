import { db } from '@/firebase/firebase-config.js'
import getFriendlyAuthError from '@utils/getFriendlyAuthError'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'

/**
 * creates a project task
 * @param {string} userId - ID of the user
 * @param {string} projectId - ID of the project
 * @param {string} task - Data of the task
 * @throws A getFriendlyAuthError object if the data is not found: {code: string, message: string}
 */
export default async function createTask(userId, projectId, task) {
  if (!userId || typeof userId !== 'string')
    throw Error('createTask error: Invalid userId')

  if (!projectId || typeof projectId !== 'string')
    throw Error('createTask error: Invalid projectId')

  if (!task || typeof task !== 'object' || Object.keys(task).length === 0)
    throw Error('createTask error: No task data provided!')

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
    console.error('createTask error:', err)
    throw getFriendlyAuthError(err.message).message
  }
}
