import formatTimestamp from '@utils/formatTimestamp'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import getMetricPeriod from './getMetricPeriod.js'
import getMetricsToUpdate from './getMetricsToUpdate.js'
import getMembersTemplate from './membersTemplate'

export default function getMembersMetrics(tasks, members) {
  if (!tasks || tasks?.length === 0 || !members || members?.length === 0) return

  const subtasks = tasks.flatMap(task => task.subtasks)

  const metrics = new Map()

  for (const member of members) {
    if (metrics.get(member)) continue

    metrics.set(member.id, { ...getMembersTemplate(), id: member.id })
  }

  for (const task of [...tasks, ...subtasks]) {
    const isDone = task.status === 'done'
    const completedBy = task.completedBy

    const isCancelled = task.status === 'cancelled'
    const cancelledBy = task.cancelledBy

    const onTime = task.wasOnTime
    const isOverdue = taskIsOverdue(task)
    const assignedTo = task.assignedTo

    // we use this ids to get the assigned tasks metrics
    const memberId = completedBy || cancelledBy

    // the member was kicked from the project but he worked on some tasks
    if (!metrics.get(memberId) && memberId) {
      metrics.set(memberId, { ...getMembersTemplate(), id: memberId })
    }

    if (task.dueDate && !isDone && !isCancelled) {
      for (const member of assignedTo) {
        const updatedMetrics = { ...metrics.get(member) }

        updatedMetrics.assignedTasks[isOverdue ? 'overdue' : 'pending'] += 1
        metrics.set(member, updatedMetrics)
      }
    }

    if (isDone && completedBy) {
      const completedDate = task?.completedDate
        ? formatTimestamp(task.completedDate).raw
        : null
      const completedPeriod = getMetricPeriod(completedDate)
      const fieldsToIncrement = getMetricsToUpdate(completedPeriod)

      if (fieldsToIncrement.length) {
        const updatedMetrics = { ...metrics.get(memberId) }

        for (const field of fieldsToIncrement) {
          updatedMetrics.completedTasks[field] += 1

          if (onTime) {
            updatedMetrics.completedOnTime[field] += 1
          }
        }

        updatedMetrics.completedTasks.total += 1

        if (onTime) {
          updatedMetrics.completedOnTime.total += 1
        }

        // get assigned tasks completed by the user
        if (assignedTo.includes(completedBy) || completedBy === memberId) {
          updatedMetrics.assignedTasks.completed += 1
          updatedMetrics.assignedTasks.total += 1

          if (onTime) {
            updatedMetrics.assignedTasks.completedOnTime += 1
          }
        }

        metrics.set(completedBy, updatedMetrics)
      }
    }

    if (isCancelled && cancelledBy) {
      const cancelledDate = task?.cancelledDate
        ? formatTimestamp(task.cancelledDate).raw
        : null
      const cancelledPeriod = getMetricPeriod(cancelledDate)
      const fieldsToIncrement = getMetricsToUpdate(cancelledPeriod)

      if (fieldsToIncrement.length) {
        const updatedMetrics = { ...metrics.get(memberId) }

        for (const field of fieldsToIncrement) {
          updatedMetrics.cancelledTasks[field] += 1
        }

        updatedMetrics.cancelledTasks.total += 1

        if (assignedTo.includes(cancelledBy) || cancelledBy === memberId) {
          updatedMetrics.assignedTasks.cancelled += 1
          updatedMetrics.assignedTasks.total += 1
        }

        metrics.set(cancelledBy, updatedMetrics)
      }
    }
  }

  return [...metrics.values()]
}
