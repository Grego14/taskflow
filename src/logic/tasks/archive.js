export default async function archiveTasksAction(params) {
  const { taskIds, isPreview, ownerId, projectId } = params

  try {
    const { default: archiveRemoteTasks } = 
      await import('@services/firebase/tasks/archive')

    await archiveRemoteTasks({ ownerId, projectId, taskIds })
    return { success: true }
  } catch (e) {
    console.error('Task Service (archive):', e)
    throw e
  }
}
