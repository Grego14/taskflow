import { dbAdapter } from './dbAdapter'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'

const projectService = {
  getDrawerQueries: (uid) => ({
    userProjects: dbAdapter.getQuery(
      dbAdapter.getColRef('users', uid, 'projects'),
      ['drawerData', '==', true]
    ),
    externalProjects: dbAdapter.getGroupQuery(
      'projects',
      ['members', 'array-contains', uid],
      ['drawerData', '==', true]
    )
  }),

  // used on the drawer toolbar
  formatDrawerProject: (doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      owner: data.owner
    }
  },

  getProjectsQueries: (uid) => ({
    userProjects: dbAdapter.getGroupQuery(
      'projects',
      ['createdBy', '==', uid],
      ['drawerData', '==', false]
    ),
    externalProjects: dbAdapter.getGroupQuery(
      'projects',
      ['members', 'array-contains', uid],
      ['createdBy', '!=', uid],
      ['drawerData', '==', false]
    )
  }),

  // used /projects
  formatProject: (doc) => ({
    id: doc.id,
    ...doc.data()
  }),

  removeProject: async (uid, projectId, onProgress) => {
    if (!uid || !projectId) throw new Error('removeProject: Missing params')

    try {
      const projectRef = dbAdapter.getDocRef(
        'users',
        uid,
        'projects',
        projectId
      )
      const projectDrawerRef = dbAdapter.getDocRef(
        'users',
        uid,
        'projects',
        `${projectId}_drawer`
      )
      const batch = dbAdapter.createBatch()

      // get tasks
      await onProgress({ stage: 'tasks' })
      const tasksSnapshot =
        await dbAdapter.getDocs(dbAdapter.getColRef(projectRef, 'tasks'))
      const totalTasks = tasksSnapshot.size
      let totalSubtasks = 0

      await onProgress({ stage: 'subtasks', count: totalTasks })

      for (const taskDoc of tasksSnapshot.docs) {
        batch.delete(taskDoc.ref)

        // get subtasks
        const subtasksSnap =
          await dbAdapter.getDocs(dbAdapter.getColRef(taskDoc.ref, 'subtasks'))
        totalSubtasks += subtasksSnap.size

        for (const subtaskDoc of subtasksSnap.docs) {
          batch.delete(subtaskDoc.ref)
        }
      }

      await onProgress({ stage: 'deleting', totalTasks, totalSubtasks })

      batch.delete(projectRef)
      batch.delete(projectDrawerRef)

      await onProgress({ stage: 'project', totalTasks, totalSubtasks })
      await batch.commit()

      return { totalTasks, totalSubtasks }
    } catch (err) {
      console.error('Error deleting project:', err)
      throw getFriendlyErrorFormatted('removeProject', err.message)
    }
  },

  archiveProject: async (uid, projectId) => {
    if (!uid || !projectId) throw new Error('archiveProject: Missing params')

    try {
      const projectRef = dbAdapter.getDocRef('users', uid, 'projects', projectId)

      await dbAdapter.update(projectRef, {
        isArchived: true,
        archivedDate: new Date().toISOString()
      })

      return { success: true }
    } catch (err) {
      console.error('Error archiving project:', err)
      throw getFriendlyErrorFormatted('archiveProject', err.message)
    }
  },

  abandonProject: async (uid, projectId, ownerId) => {
    if (!uid || !projectId || !ownerId) throw new Error('abandonProject: Missing params')

    try {
      const batch = dbAdapter.createBatch()
      const projectRef = dbAdapter.getDocRef('users', ownerId, 'projects', projectId)
      const projectDrawerRef = dbAdapter.getDocRef(
        'users',
        ownerId,
        'projects',
        `${projectId}_drawer`
      )

      const updateData = { members: dbAdapter.removeFromArray(uid) }

      batch.update(projectRef, updateData)
      batch.update(projectDrawerRef, updateData)

      await batch.commit()
      return { success: true }
    } catch (err) {
      throw getFriendlyErrorFormatted('abandonProject', err.message)
    }
  },

  // fetch members profile data
  getProjectMembers: async (membersIds) => {
    if (!membersIds || membersIds.length === 0) return null

    try {
      const q = dbAdapter.getQuery(
        dbAdapter.getColRef('users'),
        [dbAdapter.documentId(), 'in', membersIds]
      )

      const snapshot = await dbAdapter.getDocs(q)

      if (snapshot.empty) return null

      return snapshot.docs.map(snap => ({
        id: snap.id,
        ...snap.data().profile
      }))
    } catch (err) {
      console.error(err)
      throw getFriendlyErrorFormatted('getProjectMembers', err.message)
    }
  },

  // listen to a single project and verify access
  listenProject: (ownerId, projectId, callback) => {
    const projectRef = dbAdapter.getDocRef('users', ownerId, 'projects', projectId)

    return dbAdapter.listen(projectRef, (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data(), exists: true })
      } else {
        callback({ exists: false })
      }
    })
  },

  updateProject: async (uid, projectId, data = {}) => {
    if (!uid || !projectId) throw new Error('updateProject: Missing params')
    if (Object.keys(data).length < 1) throw new Error('updateProject: Data is empty')

    // protected fields check
    if (data.owner || data.createdAt) {
      throw new Error('updateProject: Cannot change owner or creation date')
    }

    try {
      const batch = dbAdapter.createBatch()
      const projectRef = dbAdapter.getDocRef('users', uid, 'projects', projectId)

      // sync members with drawer if updated
      if (data.members) {
        const drawerRef = dbAdapter.getDocRef('users', uid, 'projects', `${projectId}_drawer`)
        batch.update(drawerRef, { members: data.members })
      }

      batch.update(projectRef, data)
      await batch.commit()
      return { success: true }
    } catch (err) {
      console.error('UpdateProject Error:', err)
      throw getFriendlyErrorFormatted('updateProject', err.message)
    }
  }
}

export default projectService
