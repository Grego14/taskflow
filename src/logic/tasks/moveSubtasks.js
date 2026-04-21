import { setItem, getItem } from '@utils/storage'
import preparePromotedSubtask from './utils/preparePromotedSubtask'

export default async function moveSubtasksAction(params) {
  const { 
    taskId, 
    subtaskIds, 
    isPreview, 
    ownerId, 
    projectId, 
    position
  } = params

  if (isPreview) {
    const timestamp = Date.now()
    const localData = getItem('preview', {})
    const tasks = localData.tasks || []

    const idsToPromote = new Set(subtaskIds)
    const updatedTasks = []

    for (const task of tasks) {
      // do nothing if is the parent task
      if (task.id === taskId) continue

      // promote the subtask
      if (idsToPromote.has(task.id)) {
        updatedTasks.push({
          ...preparePromotedSubtask(task, position, timestamp),
          id: task.id
        })
        continue
      }

      updatedTasks.push(task)
    }

    setItem('preview', {
      ...localData,
      tasks: updatedTasks
    })

    return { success: true }
  }

  try {
    const { default: moveSubtasksService } = 
      await import('@services/firebase/tasks/moveSubtasks')
    
    return await moveSubtasksService({
      user: ownerId,
      project: projectId,
      task: taskId,
      subtaskIds,
      position
    })
  } catch (e) {
    console.error('Task Service (moveSubtasks):', e)
    throw e
  }
}
