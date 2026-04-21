import { dbAdapter } from '@services/dbAdapter'
import getTaskPath from '@utils/tasks/getTaskPath'

export const archiveRemoteTasks = async ({ ownerId, projectId, taskIds }) => {
  if (!ownerId || !projectId || !taskIds?.length) 
    throw Error('archiveTasks: Missing params')

  const batch = dbAdapter.createBatch()
  const updatedAt = dbAdapter.getServerTimestamp()
  const path = getTaskPath(ownerId, projectId) 

  for (const id of taskIds) {
    const ref = dbAdapter.getDocRef(path, id)
    batch.update(ref, {
      isArchived: true,
      updatedAt,
      archivedAt: updatedAt
    })
  }

  return await batch.commit()
}
