import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError.js'
import { doc, updateDoc } from 'firebase/firestore'
import db from '@/db'

/**
 * Updates a user's document in Firestore with the provided fields.
 * Allows partial updates for almost all the db fields.
 *
 * @param {string} uid The User ID (UID) of the user to update.
 * @param {object} data An object containing the fields to update.
 * @param {string} [data.theme] The UI theme.
 * @param {string} [data.lang] The UI language.
 * @param {string} [data.username] The username.
 * @param {string} [data.avatar] The avatar URL.
 * @param {string} [data.lastEditedProject] The ID of the last edited project.
 * @param {string} [data.lastEditedProjectOwner] The ID of the last edited project owner.
 * @param {string} [data.lastUsedFilter] The last used tasks filter.
 * @param {string} [data.previewer] The last used previewer.
 * @returns {Error<{error: boolean, message: string}>} An object with the status and a message.
 * @throws {Error} If the `uid` is not valid.
 */
export default async function updateUser(uid, data) {
  if (!uid || typeof uid !== 'string')
    throw Error('updateUser: uid must be a valid user id string!')

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0)
    return

  try {
    const userRef = doc(db, 'users', uid)
    const updatePayload = {}

    if (data.username) {
      updatePayload['profile.username'] = data.username
    }

    if (data.avatar) {
      updatePayload['profile.avatar'] = data.avatar
    }

    if (data.lang) {
      updatePayload['preferences.lang'] = data.lang
    }

    if (data.theme) {
      updatePayload['preferences.theme'] = data.theme
    }

    if (data.previewer) {
      updatePayload['preferences.previewer'] = data.previewer
    }

    if (data.lastEditedProject) {
      updatePayload['metadata.lastEditedProject'] = data.lastEditedProject
    }

    if (data.lastEditedProjectOwner) {
      updatePayload['metadata.lastEditedProjectOwner'] =
        data.lastEditedProjectOwner
    }

    if (data.lastUsedFilter) {
      updatePayload['metadata.lastUsedFilter'] = data.lastUsedFilter
    }

    if (data.lastUsedMetricFilter) {
      updatePayload['metadata.lastUsedMetricFilter'] =
        data?.lastUsedMetricFilter
    }

    if (Object.keys(updatePayload).length === 0)
      throw Error('updateUser: No valid fields provided for update')

    await updateDoc(userRef, updatePayload)

    return { error: false, message: 'success' }
  } catch (e) {
    console.error(e.message)
    return {
      error: true,
      message: getFriendlyErrorFormatted('updateUser', e.message).message
    }
  }
}
