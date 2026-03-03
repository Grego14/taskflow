export default function taskIsOverdue(task) {
  if (!task || !task.dueDate) return false

  const date = task.dueDate?.seconds ? task.dueDate.toDate() : task.dueDate

  const dueDate = new Date(date)
  const now = new Date()

  return dueDate < now
}
