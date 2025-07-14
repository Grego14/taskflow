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
  if (!userId) throw Error('Invalid userId', userId)
  if (!data) throw Error('Invalid project data', data)

  // TODO - Verify data fields

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

    return projectDoc.exists() ? { id: projectRef.id, data: projectData } : null
  } catch (err) {
    console.error('createProject:', err)
    throw getFriendlyAuthError(err.message).message
  }
}
