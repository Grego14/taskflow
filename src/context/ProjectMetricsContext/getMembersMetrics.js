import formatTimestamp from '@utils/formatTimestamp'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import getMetricPeriod from './getMetricPeriod.js'
import getMetricsToUpdate from './getMetricsToUpdate.js'
import getMembersTemplate from './membersTemplate'

export default function getMembersMetrics(tasks, members) {
  if (!tasks?.length || !members?.length) return []

  const metrics = new Map()

  // initialize Map with current members
  for (const member of members) {
    metrics.set(member.id, { ...getMembersTemplate(), id: member.id })
  }

  const allItems = tasks.reduce((acc, task) => {
    acc.push(task)
    if (task.subtasks?.length) {
      for (const subtask of task.subtasks) acc.push(subtask)
    }
    return acc
  }, [])

  for (const item of allItems) {
    const {
      status,
      completedBy,
      cancelledBy,
      wasOnTime,
      assignedTo = [],
      dueDate,
      completedDate,
      cancelledDate
    } = item

    const isDone = status === 'done'
    const isCancelled = status === 'cancelled'
    const performerId = completedBy || cancelledBy

    // ensure performer exists in metrics (even if they were removed from the project)
    if (performerId && !metrics.has(performerId)) {
      metrics.set(performerId, { ...getMembersTemplate(), id: performerId })
    }

    // process ASSIGNED tasks (pending & overdue)
    if (dueDate && !isDone && !isCancelled) {
      const field = taskIsOverdue(item) ? 'overdue' : 'pending'

      for (const mId of assignedTo) {
        const m = metrics.get(mId)
        if (m) m.assignedTasks[field]++
      }
      continue
    }

    // process COMPLETED or CANCELLED tasks
    if ((isDone && completedDate) || (isCancelled && cancelledDate)) {
      const dateRaw = isDone
        ? formatTimestamp(completedDate)?.raw
        : formatTimestamp(cancelledDate)?.raw

      const period = getMetricPeriod(dateRaw)
      const performer = metrics.get(performerId)

      if (!period || !performer) continue

      const fieldsToUpdate = getMetricsToUpdate(period)
      const targetSubKey = isDone ? 'completedTasks' : 'cancelledTasks'

      // update time-based metrics
      for (const field of fieldsToUpdate) {
        performer[targetSubKey][field]++
        if (isDone && wasOnTime) {
          performer.completedOnTime[field]++
        }
      }

      // update totals
      performer[targetSubKey].total++

      if (isDone && wasOnTime) performer.completedOnTime.total++

      if (assignedTo.length === 0 || !assignedTo.includes(performerId)) continue

      // update assigned stats if the performer was also an assignee
      const assigned = performer.assignedTasks
      assigned.total++

      assigned[isDone ? 'completed' : 'cancelled']++

      // wasOnTime can only be true if the task is completed so we don't check
      // if the task isn't done
      if (wasOnTime) assigned.completedOnTime++
    }
  }

  return Array.from(metrics.values())
}
