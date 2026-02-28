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

const user = {
  /**
   * Updates specific fields in the user document
   */
  update: async (uid, data) => {
    if (!uid || typeof uid !== 'string')
      throw Error('user.update: uid must be a valid string')

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0)
      throw Error('user.update: data object is empty')

    try {
      const userRef = dbAdapter.getDocRef('users', uid)
      const updatePayload = {}

      for (const key of Object.keys(data)) {
        const dbPath = USER_FIELDS_MAP[key]

        if (dbPath && data[key] !== undefined) {
          updatePayload[dbPath] = data[key]
        }
      }

      if (Object.keys(updatePayload).length === 0) {
        throw Error('user.update: No valid fields provided')
      }

      await dbAdapter.update(userRef, updatePayload)

      return { error: false, message: 'success' }
    } catch (e) {
      console.error('User Service (update):', e.message)
      return {
        error: true,
        message: getFriendlyErrorFormatted('updateUser', e.message).message
      }
    }
  },

  /**
   * Performs a cascading delete of the user and all related sub-collections
   */
  delete: async (uid) => {
    if (!uid || typeof uid !== 'string')
      throw Error('user.delete: Invalid user param')

    try {
      const batch = dbAdapter.createBatch()
      const userRef = dbAdapter.getDocRef('users', uid)

      // projects and nested tasks
      const projectsCol = dbAdapter.getColRef(userRef, 'projects')
      const projectsSnap = await dbAdapter.getDocs(projectsCol)

      for (const projectDoc of projectsSnap.docs) {
        const projectId = projectDoc.id
        const projectRef = projectDoc.ref

        // drawer projects don't have tasks
        if (projectId.includes('drawer')) {
          batch.delete(projectRef)
          continue
        }

        const tasksColRef = dbAdapter.getColRef(projectRef, 'tasks')
        const tasksSnapshot = await dbAdapter.getDocs(tasksColRef)

        for (const taskDoc of tasksSnapshot.docs) {
          const subtasksColRef = dbAdapter.getColRef(taskDoc.ref, 'subtasks')
          await dbAdapter.deleteCollection(subtasksColRef)

          batch.delete(taskDoc.ref)
        }

        batch.delete(projectRef)
      }

      // notifications
      const notificationsCol = dbAdapter.getColRef(userRef, 'notifications')
      const notificationsSnap = await dbAdapter.getDocs(notificationsCol)

      for (const notification of notificationsSnap.docs) {
        batch.delete(notification.ref)
      }

      await batch.commit()
      await dbAdapter.remove(userRef)

      return { error: false, message: 'success' }
    } catch (e) {
      console.error('User Service (delete):', e.message)
      return {
        error: true,
        message: getFriendlyErrorFormatted('deleteUser', e.message).message
      }
    }
  },

  /**
     * Finds a user by email and returns their profile and id
     * Used for project invitations
     */
  getByEmail: async (email) => {
    if (!email || typeof email !== 'string') return null

    try {
      const usersCol = dbAdapter.getColRef('users')
      const q = dbAdapter.getQuery(usersCol, ['profile.email', '==', email])
      const snapshot = await dbAdapter.getDocs(q)

      if (snapshot.empty) return null

      // since emails are unique identifiers in auth, we take the first match
      const userDoc = snapshot.docs[0]
      const userData = userDoc.data()

      return {
        id: userDoc.id,
        ...userData.profile
      }
    } catch (e) {
      console.error('User Service (getByEmail):', e.message)
      return {
        error: true,
        message: getFriendlyErrorFormatted('searchUsers', e.message).message
      }
    }
  },

  /**
   * Initializes a new user document in Firestore after Auth sign-up
   */
  create: async (userData, preferences = {}) => {
    if (!userData?.uid)
      throw Error('user.create: Missing user UID')

    const { uid, displayName, email, photoURL } = userData

    try {
      const userRef = dbAdapter.getDocRef('users', uid)

      const payload = {
        profile: {
          username: displayName || '',
          email: email || '',
          avatar: photoURL || ''
        },
        preferences: {
          lang: 'en',
          theme: 'light',
          ...preferences,
          previewer: 'list'
        },
        metadata: {
          lastEditedProject: '',
          lastEditedProjectOwner: '',
          lastUsedFilter: 'default',
          lastUsedMetricFilter: 'project'
        }
      }

      await dbAdapter.set(userRef, payload)
      return { error: false, message: 'User document created' }
    } catch (e) {
      console.error('User Service (create):', e.message)
      return {
        error: true,
        message: getFriendlyErrorFormatted('createUser', e.message).message
      }
    }
  },
}

export default user
