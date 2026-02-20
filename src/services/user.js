import { dbAdapter } from './dbAdapter'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'

const USER_FIELDS_MAP = {
  username: 'profile.username',
  avatar: 'profile.avatar',
  lang: 'preferences.lang',
  theme: 'preferences.theme',
  previewer: 'preferences.previewer',
  lastEditedProject: 'metadata.lastEditedProject',
  lastEditedProjectOwner: 'metadata.lastEditedProjectOwner',
  lastUsedFilter: 'metadata.lastUsedFilter',
  lastUsedMetricFilter: 'metadata.lastUsedMetricFilter'
}

/**
 * Updates user document using the dbAdapter
 * Removed unused 'db' and 'updateDoc' imports
 */
export default async function updateUser(uid, data) {
  if (!uid || typeof uid !== 'string') {
    throw Error('updateUser: uid must be a valid user id string!')
  }

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0)
    throw Error('updateUser: data object is empty')

  try {
    const userRef = dbAdapter.getDocRef('users', uid)
    const updatePayload = {}

    for (const key of Object.keys(data)) {
      const dbPath = USER_FIELDS_MAP[key]

      // check if the field is allowed and specifically not undefined
      // This allows '', null, false, 0 to pass through
      if (dbPath && data[key] !== undefined) {
        updatePayload[dbPath] = data[key]
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      throw Error('updateUser: No valid fields provided for update')
    }

    await dbAdapter.update(userRef, updatePayload)

    return { error: false, message: 'success' }
  } catch (e) {
    console.error('User service:', e.message)
    return {
      error: true,
      message: getFriendlyErrorFormatted('updateUser', e.message).message
    }
  }
}
