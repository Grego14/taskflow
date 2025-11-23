const getSubtasks = tasks => tasks.flatMap(task => task.subtasks)

export const getCompletedTasks = (tasks, filter) => {
  if (filter !== 'default' || !Array.isArray(tasks)) return null

  const subtasks = getSubtasks(tasks)
  const completedTasks = tasks.filter(task => task.status === 'done')
  const completedSubtasks = subtasks.filter(
    // the parent task should be completed to show the subtask inside the
    // "completed tasks" wrapper
    task => task.status === 'done' && completedTasks?.[task.subtask]
  )

  return [...completedTasks, ...completedSubtasks]
}

export const getCancelledTasks = (tasks, filter) => {
  if (filter !== 'default' || !Array.isArray(tasks)) return null

  const subtasks = getSubtasks(tasks)
  const cancelledTasks = tasks.filter(task => task.status === 'cancelled')
  const cancelledSubtasks = subtasks.filter(
    subtask => subtask.status === 'cancelled'
  )

  return [...cancelledTasks, ...cancelledSubtasks]
}
