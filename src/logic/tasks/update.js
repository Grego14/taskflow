import { setItem, getItem } from '@utils/storage'

export default async function updateTaskAction(params) {
  const { id, data, isPreview, ownerId, projectId, parentId } = params

  if (!data || Object.keys(data).length < 1) return
  if (data.createdAt) throw Error('updateTask: Cannot update createdAt')

  if (isPreview) {
    const timestamp = Date.now()
    const isDone = data.status === 'done'
    const isCancelled = data.status === 'cancelled'

    const payload = {
      ...data,
      updatedAt: timestamp,
      completedDate: isDone ? timestamp : null,
      cancelledDate: isCancelled ? timestamp : null
    }

    const localData = getItem('preview', {})
    const tasks = localData.tasks || []

    const updatedTasks = tasks.map(task => task.id === id 
      ? { ...task, ...payload } 
      : task)

    setItem('preview', {
      ...localData,
      tasks: updatedTasks
    })

    return payload
  } else {
    try {
      const { default: updateRemoteTask } = 
        await import('@services/firebase/tasks/update')

      await updateRemoteTask({ 
        ownerId, 
        projectId, 
        taskId: id, 
        parentId, 
        data: data
      })

      // use Date.now() until firebase updates the timestamp
      return { ...data, updatedAt: Date.now() }
    } catch (e) {
      console.error('Task Service (update):', e)
      throw e
    }
  }
}
