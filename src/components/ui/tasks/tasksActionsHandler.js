export default function tasksActionsHandler(task) {
  const action = task.dataset?.action
  const id = task.dataset?.taskid

  if (!id || !action) return {}

  return { id, action }
}
