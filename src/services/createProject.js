import { db } from '@/firebase/firebase-config.js'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  writeBatch
} from 'firebase/firestore'
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
    const batch = writeBatch(db)
    const projectCol = collection(db, 'users', userId, 'projects')
    const members = [userId, ...(data?.members || [])]

    const projectRef = await addDoc(projectCol, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
      members,
      isTemplate: data?.isTemplate,
      isArchived: false,
      // allow us to reuse the same firebase index used when querying the
      // ${projectId}_drawer data
      drawerData: false
    })

    batch.update(projectRef, {
      id: projectRef.id
    })

    batch.set(doc(projectCol, `${projectRef.id}_drawer`), {
      id: projectRef.id,
      name: data.name,
      drawerData: true,
      members,
      owner: userId
    })

    await batch.commit()

    return projectRef.id
  } catch (err) {
    console.error('createProject error:', err)
    throw getFriendlyAuthError(err.message).message
  }
}
