import { db } from '@/firebase/firebase-config.js'
import getFriendlyAuthError from '@utils/getFriendlyAuthError'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

/**
 * creates a project task
 * @param {string} user - ID of the user
 * @param {string} project - ID of the project
 * @param {string} data - Data of the task
 * @throws A getFriendlyAuthError object if the data is not found: {code: string, message: string}
 */
export default async function createTask({ user, project, data }) {
  if (!user || typeof user !== 'string')
    throw Error('createTask error: Invalid user id')

  if (!project || typeof project !== 'string')
    throw Error('createTask error: Invalid project id')

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0)
    throw Error('createTask error: No task data provided!')

  try {
    const taskRef = collection(db, 'users', user, 'projects', project, 'tasks')

    await addDoc(taskRef, {
      ...data,
      id: taskRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: user
    })
  } catch (err) {
    console.error('createTask error:', err)
    throw getFriendlyAuthError(err.message).message
  }
}
