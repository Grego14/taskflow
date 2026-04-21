import { dbAdapter } from '../dbAdapter'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'

/** 
 * @param {string} uid
 * @param {string} ownerId
 * @param {string} projectId
 *
 * removes a user from all assigned tasks within a specific project 
*/
export default function removeUserAssignments(uid, ownerId, projectId) {
  if (!uid || !ownerId || !projectId) 
    throw Error('removeUserAssignments: Missing params')

  try {
    const projectRef = dbAdapter.getDocRef('users', ownerId, 'projects', projectId)
    const tasksRef = dbAdapter.getColRef(projectRef, 'tasks')

    const tasksSnapshot = await dbAdapter.getDocs(tasksRef)
    const batch = dbAdapter.createBatch()

    batch.update(projectRef, { members: dbAdapter.removeFromArray(uid) })

    for (const taskDoc of tasksSnapshot.docs) {
      const taskData = taskDoc.data()

      if (taskData.assignedTo?.includes(uid)) {
        batch.update(taskDoc.ref, {
          assignedTo: dbAdapter.removeFromArray(uid)
        })
      }
    }

    await batch.commit()
  } catch (e) {
    console.error('Task Service (removeAssignments):', e.message)
    throw getFriendlyErrorFormatted('removeUserAssignments', e.message).message
  }
}
