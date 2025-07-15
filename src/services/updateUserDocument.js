import { doc, updateDoc } from 'firebase/firestore'
import getFriendlyAuthError from '@utils/getFriendlyAuthError'
import { db } from '@/firebase/firebase-config.js'

/**
 * Updates the user firebase document
 * @param {string} uid - ID of the user
 * @param {Object} data - The data to update
 * @param {Object} [data.profile] - Profile data to update
 * @param {string} [data.profile.avatar] - User avatar URL
 * @param {string} [data.profile.username] - Username
 * @param {string} [data.profile.email] - User email
 * @param {Object} [data.preferences] - Preferences data to update
 * @param {string} [data.preferences.theme] - UI theme preference
 * @param {string} [data.preferences.lang] - Language preference
 * @param {Object} [data.metadata] - Metadata to update
 * @param {Timestamp} [data.metadata.lastSession] - Last session timestamp
 * @param {string} [data.metadata.lastEditedProject] - Last edited project id
 * @returns {Promise<void>}
 * @throws A friendly auth error string
 */
export default async function updateUserDocument(uid, data) {
  if (!uid || typeof uid !== 'string')
    throw Error('updateUserDocument error: Invalid uid!')

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0)
    throw Error('updateUserDocument error: No data provided to update!')

  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, updateData)
  } catch (error) {
    console.error(
      "updateUserDocument error: Couldn't update the user document",
      error
    )
    throw getFriendlyAuthError(error.message).message
  }
}
