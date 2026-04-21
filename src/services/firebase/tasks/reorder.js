import { dbAdapter } from '@services/dbAdapter'
import getTaskPath from '@utils/tasks/getTaskPath'

export default async function reorderRemoteTask({ 
  ownerId, 
  projectId, 
  taskId, 
  parentId, 
  newPosition,
  newStatus 
}) {
  const path = getTaskPath(ownerId, projectId, parentId)
  const ref = dbAdapter.getDocRef(path, taskId)
  const timestamp = dbAdapter.getServerTimestamp()

  const updates = {
    position: newPosition,
    updatedAt: timestamp
  }

  if (newStatus) {
    updates.status = newStatus
    const isDone = newStatus === 'done'
    const isCanc = newStatus === 'cancelled'

    updates.completedDate = isDone ? timestamp : null
    updates.cancelledDate = isCanc ? timestamp : null
  }

  return await dbAdapter.update(ref, updates)
}
