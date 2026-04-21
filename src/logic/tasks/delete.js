import { setItem, getItem } from '@utils/storage'

export default async function deleteTaskAction(params) {
  const { id, parentId, deleteSubtasks, isPreview, ownerId, projectId } = params

  if (isPreview) {
    const localData = getItem('preview') || {}
    const tasks = localData.tasks || []

    let newTasks = tasks.filter(task => task.id !== id)

    // if is a task and the user wants to delete the subtasks
    if (!parentId && deleteSubtasks) {
      newTasks = newTasks.filter(sTask => sTask.parentId !== id)
    }

    setItem('preview', { ...localData, tasks: newTasks })
    return { success: true }
  }

  try {
    const { default: deleteRemoteTask } = await import('@services/firebase/tasks/delete')
    await deleteRemoteTask({
      ownerId,
      projectId,
      taskId: id,
      parentId,
      deleteSubtasks
    })

    return { success: true }
  } catch (e) {
    console.error('Task Service (delete):', e)
    throw e
  }
}
