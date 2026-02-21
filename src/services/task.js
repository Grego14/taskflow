import { dbAdapter } from './dbAdapter'

const taskService = {
  // removes a user from all assigned tasks within a specific project
  removeUserAssignments: async (uid, ownerId, projectId) => {
    if (!uid || !ownerId || !projectId)
      throw new Error('removeUserAssignments: Missing params')

    try {
      const projectRef = dbAdapter.getDocRef(
        'users',
        ownerId,
        'projects',
        projectId
      )
      const tasksRef = dbAdapter.getColRef(projectRef, 'tasks')
      const tasksSnapshot = await dbAdapter.getDocs(tasksRef)

      const batch = dbAdapter.createBatch()

      for (const taskDoc of tasksSnapshot.docs) {
        const taskData = taskDoc.data()
        // if user is assigned, remove them using arrayRemove adapter
        if (taskData.assignedTo?.includes(uid)) {
          batch.update(taskDoc.ref, {
            assignedTo: dbAdapter.removeFromArray(uid)
          })
        }
      }

      await batch.commit()
    } catch (err) {
      console.error('Error removing user assignments:', err)
      throw err
    }
  }
}

export default taskService
