export default function resolveTaskStatusUpdate(
  taskData, 
  nextStatus, 
  uid, 
  isPreview
) {
  const isDone = nextStatus === 'done'
  const isCanc = nextStatus === 'cancelled'

  const now = new Date()
  const timestamp = isPreview ? now.getTime() : now

  // wasOnTime metric logic (not used on the app demo)
  let wasOnTime = null
  if (!isPreview && nextStatus === 'done' && taskData?.dueDate) {
    const dueDate = taskData.dueDate?.seconds 
      ? new Date(taskData.dueDate.seconds * 1000) 
      : new Date(taskData.dueDate)
    
    wasOnTime = now <= dueDate
  }

  return {
    status: nextStatus,
    updatedAt: timestamp,
    wasOnTime: nextStatus !== 'todo' ? wasOnTime : null,
    completedDate: nextStatus === 'done' ? timestamp : null,
    cancelledDate: nextStatus === 'cancelled' ? timestamp : null,
    completedBy: nextStatus === 'done' ? uid : null,
    cancelledBy: nextStatus === 'cancelled' ? uid : null
  }
}
