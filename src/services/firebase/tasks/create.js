import { dbAdapter } from '@services/dbAdapter'
import getTaskPath from '@utils/tasks/getTaskPath'

export default async function createRemoteTask({ 
  ownerId, 
  projectId, 
  parentId, 
  task
}) {
  if (!ownerId || !projectId || !task) throw Error('createTask: Missing params')

  const path = getTaskPath(ownerId, projectId, parentId)
  const docRef = dbAdapter.getDocRef(path, task.id)

  const timestamp = dbAdapter.getServerTimestamp()

  return await dbAdapter.set(docRef, {
    ...task,
    createdAt: timestamp,
    updatedAt: timestamp
  })
}
