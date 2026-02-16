import i18n from '@/i18n'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import { dbAdapter } from './dbAdapter'

const handleError = (action, error) => {
  throw getFriendlyErrorFormatted(action, error.message, i18n.language)
}

// base structure for all notifications
const createBaseNotification = (type, extraData = {}) => ({
  type,
  notificationDate: dbAdapter.getServerTimestamp(),
  read: false,
  ...extraData
})

export const notificationService = {
  getNotificationsQuery: (uid) => dbAdapter.getColRef('users', uid, 'notifications'),

  // --- Create ---
  sendWelcome: async (uid) => {
    try {
      const data = createBaseNotification('welcome')
      return await dbAdapter.add(
        dbAdapter.getColRef('users', uid, 'notifications'), data
      )
    } catch (err) {
      handleError('sendWelcomeNotification', err)
    }
  },

  sendKicked: async (uid, kickedBy, projectName) => {
    try {
      const data = createBaseNotification('kicked', { kickedBy, projectName })
      return await dbAdapter.add(
        dbAdapter.getColRef('users', uid, 'notifications'), data
      )
    } catch (err) {
      handleError('sendKickedNotification', err)
    }
  },
  // --- Create End ---

  // --- Update / Actions ---
  markAsRead: async (uid, notificationIds) => {
    try {
      const batch = dbAdapter.createBatch()
      for (const id of notificationIds) {
        const ref = dbAdapter.getDocRef('users', uid, 'notifications', id)
        batch.update(ref, { read: true })
      }
      await batch.commit()
    } catch (err) {
      console.error('Error marking notifications as read:', err)
    }
  },

  manageInvitation: async ({
    user,
    notification,
    action,
    projectOwner,
    projectId
  }) => {
    try {
      const batch = dbAdapter.createBatch()
      const isAccept = action === 'accept'

      const notifRef =
        dbAdapter.getDocRef('users', user, 'notifications', notification)
      const projectRef =
        dbAdapter.getDocRef('users', projectOwner, 'projects', projectId)

      // update notification state
      batch.update(notifRef, {
        accepted: isAccept,
        declined: action === 'decline',
        read: true
      })

      // 2. Si acepta, añadir a miembros en proyecto y drawer
      // if the user accepts, add to project and project drawer members
      if (isAccept) {
        const drawerRef = dbAdapter.getDocRef(
          'users', projectOwner, 'projects', `${projectId}_drawer`
        )
        const memberData = { members: dbAdapter.union(user) }

        batch.update(projectRef, memberData)
        batch.update(drawerRef, memberData)
      }

      // extract the invited user
      batch.update(projectRef, {
        invitedUsers: dbAdapter.removeFromArray(user)
      })

      await batch.commit()
    } catch (err) {
      handleError('manageProjectInvitation', err)
    }
  },
  // --- Update / Actions End ---

  delete: async (uid, notificationId) => {
    try {
      await dbAdapter.remove(dbAdapter.getNotifRef(uid, notificationId))
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }
}
