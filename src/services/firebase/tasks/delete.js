import { dbAdapter } from '@services/dbAdapter'
import getTaskPath from '@utils/tasks/getTaskPath'

export default async function deleteRemoteTask({ 
  ownerId, 
  projectId, 
  taskId, 
  parentId, 
  deleteSubtasks
}) {
  if (!ownerId || !projectId || !taskId) throw Error('deleteTask: Missing IDs')

  const path = getTaskPath(ownerId, projectId, parentId)
  const ref = dbAdapter.getDocRef(path, taskId)

  if (!parentId && deleteSubtasks) {
    const subtasksCol = dbAdapter.getColRef(`${path}/${taskId}/subtasks`)
    await dbAdapter.deleteCollection(subtasksCol)
  }

  return await dbAdapter.remove(ref)
}
