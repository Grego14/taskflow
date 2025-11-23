export default function taskIsOverdue(task) {
  if (!task || !task.dueDate) return false

  const dueDate = new Date(task.dueDate)
  const now = new Date()

  return dueDate < now
}
