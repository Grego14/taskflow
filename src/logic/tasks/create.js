import { setItem, getItem } from '@utils/storage'

export default async function createTaskAction(params) {
  const { task, isPreview, ownerId, projectId } = params
  const parentId = task?.parentId

  if (isPreview) {
    const localData = getItem('preview') || {}
    const tasks = localData.tasks || []

    setItem('preview', { 
      ...localData, 
      tasks: [...tasks, task] 
    })
    return task
  }

  try {
    const { default: createRemoteTask } = await import('@services/firebase/tasks/create')
    await createRemoteTask({
      ownerId,
      projectId,
      parentId, // only used to create the document of a subtask
      task
    })

    return
  } catch (e) {
    console.error('Task Service (create):', e)
    throw e
  }
}
