import { setItem, getItem } from '@utils/storage'

export default async function reorderTaskAction(params) {
  const { 
    ownerId, 
    projectId, 
    taskId, 
    parentId, 
    newPosition, 
    newStatus, 
    isPreview 
  } = params

  if (isPreview) {
    const localData = getItem('preview', {})
    const tasks = localData.tasks || []
    const timestamp = Date.now()

    const updatedTasks = tasks.map(task => {
      if (task.id !== taskId) return task

      const updates = {
        ...task, 
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

      return updates
    })

    setItem('preview', { ...localData, tasks: updatedTasks })
    return { position: newPosition, status: newStatus }
  }

  try {
    const { default: reorderService } = 
      await import('@services/firebase/tasks/reorder')
    
    return await reorderService({
      ownerId,
      projectId,
      taskId,
      parentId,
      newPosition,
      newStatus
    })
  } catch (e) {
    console.error('Task Logic (reorder):', e)
    throw e
  }
}
