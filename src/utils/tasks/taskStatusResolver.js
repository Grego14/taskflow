import formatTimestamp from '../formatTimestamp'

export default function resolveTaskStatusUpdate(taskData, nextStatus) {
  const isDone = nextStatus === 'done'
  const isCanc = nextStatus === 'cancelled'

  let wasOnTime = null

  if (isDone && taskData?.dueDate) {
    const now = new Date()
    const dueDate = taskData.dueDate?.seconds
      ? formatTimestamp(taskData.dueDate).raw
      : new Date(taskData.dueDate)

    wasOnTime = now <= dueDate.getTime()
  }

  return {
    status: nextStatus,
    wasOnTime: nextStatus !== 'todo' ? wasOnTime : null
  }
}
