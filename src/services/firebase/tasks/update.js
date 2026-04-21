import { dbAdapter } from '@services/dbAdapter'
import getTaskPath from '@utils/tasks/getTaskPath'

export default async function updateRemoteTask({ 
  ownerId, 
  projectId, 
  taskId, 
  parentId, 
  data
}) {
  if (!ownerId || !projectId || !taskId) throw Error('updateTask: Missing IDs')

  const path = getTaskPath(ownerId, projectId, parentId)
  const ref = dbAdapter.getDocRef(path, taskId)

  const date = dbAdapter.getServerTimestamp()
  const isDone = data.status === 'done'
  const isCancelled = data.status === 'cancelled'

  return await dbAdapter.update(ref, {
    ...data,
    updatedAt: date,
    completedDate: isDone ? date : null,
    cancelledDate: isCancelled ? date : null
  })
}
