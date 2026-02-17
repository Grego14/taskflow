import { dbAdapter } from './dbAdapter'

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
      throw err
    }
  }
}

export default projectService
