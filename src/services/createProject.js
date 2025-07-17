import {
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  collection,
  updateDoc
} from 'firebase/firestore'
import { db } from '@/firebase/firebase-config.js'
import getFriendlyAuthError from '@utils/getFriendlyAuthError'
import getProject from './getProject'

/**
 * creates a project and returns its data
 * @param {string} userId - ID of the user
 * @param {string} data - data of the project
 * @throws A getFriendlyAuthError object if the data is not found: {code: string, message: string}
 */
export default async function createProject(userId, data) {
  if (!userId || typeof userId !== 'string')
    throw Error('createProject error: Invalid userId!')

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0)
    throw Error('createProject error: No project data provided!')

  try {
    const projectCol = collection(db, 'users', userId, 'projects')

    const projectRef = await addDoc(projectCol, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
      members: [userId],
      isTemplate: false
    })

    await updateDoc(projectRef, {
      id: projectRef.id
    })

    const projectData = await getProject(userId, projectRef.id)

    return projectData
  } catch (err) {
    console.error('createProject error:', err)
    throw getFriendlyAuthError(err.message).message
  }
}
