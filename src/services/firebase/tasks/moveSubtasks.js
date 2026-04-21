import { dbAdapter } from '@services/dbAdapter'
import { taskRegistry } from '@store/tasks'
import preparePromotedSubtask from './utils/preparePromotedSubtask'

export default async function moveSubtasksService({ user, project, task, subtaskIds, position }) {
  if (!user || !project) throw Error('moveSubtasks: Invalid user or project')

  const tasksCol = dbAdapter.getColRef('users', user, 'projects', project, 'tasks')
  const timestamp = dbAdapter.getServerTimestamp()
  const batch = dbAdapter.createBatch()
  const currentTasks = taskRegistry.value

  for (const sId of subtaskIds) {
    const subtaskData = currentTasks.get(sId)
    if (!subtaskData) continue

    const newTaskRef = dbAdapter.getDocRef(tasksCol)
    const promotedData = preparePromotedSubtask(subtaskData, position, timestamp)

    batch.set(newTaskRef, {
      ...promotedData,
      id: newTaskRef.id
    })

    // delete the subtask
    batch.delete(dbAdapter.getDocRef(tasksCol, sId))
  }

  // delete the parent task
  batch.delete(dbAdapter.getDocRef(tasksCol, task))

  return await batch.commit()
}
