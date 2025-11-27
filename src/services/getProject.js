import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import { doc, getDoc } from 'firebase/firestore'
import db from '@/db'

/**
 * gets and return the firestore user project
 * @param {string} userId - ID of the user
 * @param {string} projectId - ID of the project
 * @returns The project data
 * @throws A getFriendlyAuthError object if the data is not found: {code: string, message: string}
 */
export default async function getProject(userId, projectId) {
  if (!userId || !projectId) throw Error('Invalid userId or projectId.')

  try {
    const projectRef = doc(db, 'users', userId, 'projects', projectId)
    const project = await getDoc(projectRef)

    if (!project.exists()) {
      console.warn(`Project with ID: ${projectId} not found.`)
      return null
    }

    return project.data()
  } catch (err) {
    console.error('getProject error:', err)
    throw getFriendlyAuthError(err.message)
  }
}
