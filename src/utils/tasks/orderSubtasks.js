export default function orderSubtasks(tasks, subtasks) {
  const finalTasks = Array.from(tasks.values()).map(task => ({
    ...task || {},
    subtasks: []
  }))

  const tasksById = new Map(finalTasks.map(task => [task?.id, task]))

  for (const [taskId, subtaskArray] of subtasks.entries()) {
    const parentTask = tasksById.get(taskId)

    if (parentTask) {
      parentTask.subtasks = subtaskArray
    }
  }

  return finalTasks
}

