import formatTimestamp from '@utils/formatTimestamp'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import getMetricPeriod from './getMetricPeriod'
import getMetricsToUpdate from './getMetricsToUpdate'

export default function getMetrics(tasks) {
  if (!tasks || tasks?.length === 0) return

  const subtasks = tasks.flatMap(task => task.subtasks)

  const metrics = {
    pendingTasks: 0,
    overdueTasks: 0,
    completedTasks: {
      total: 0,
      today: 0,
      yesterday: 0,
      lastWeek: 0,
      thisWeek: 0,
      thisMonth: 0,
      thisQuarterly: 0,
      thisYear: 0
    },
    completedOnTime: {
      total: 0,
      today: 0,
      yesterday: 0,
      lastWeek: 0,
      thisWeek: 0,
      thisMonth: 0,
      thisQuarterly: 0,
      thisYear: 0
    },
    cancelledTasks: {
      total: 0,
      today: 0,
      yesterday: 0,
      lastWeek: 0,
      thisWeek: 0,
      thisMonth: 0,
      thisQuarterly: 0,
      thisYear: 0
    }
  }

  for (const task of [...tasks, ...subtasks]) {
    const isOverdue = taskIsOverdue(task)
    const isDone = task.status === 'done'
    const isCancelled = task.status === 'cancelled'
    const onTime = task.wasOnTime

    if (task.dueDate && !isDone && !isCancelled) {
      if (isOverdue) {
        // overdueTasks
        metrics.overdueTasks++
      } else {
        // pendingTasks
        metrics.pendingTasks++
      }
    }

    // completedTasks
    if (isDone) {
      const completedDate = task?.completedDate
        ? formatTimestamp(task.completedDate)?.raw
        : null
      const completedPeriod = getMetricPeriod(completedDate)

      if (completedPeriod) {
        const fieldsToIncrement = getMetricsToUpdate(completedPeriod)

        for (const field of fieldsToIncrement) {
          metrics.completedTasks[field] += 1

          if (onTime) {
            metrics.completedOnTime[field] += 1
          }
        }

        metrics.completedTasks.total += 1

        if (onTime) {
          metrics.completedOnTime.total += 1
        }
      }
    }

    if (isCancelled) {
      const cancelledDate = task?.cancelledDate
        ? formatTimestamp(task.cancelledDate)?.raw
        : null
      const cancelledPeriod = getMetricPeriod(cancelledDate)

      if (cancelledPeriod) {
        const fieldsToIncrement = getMetricsToUpdate(cancelledPeriod)

        for (const field of fieldsToIncrement) {
          metrics.cancelledTasks[field] += 1
        }

        metrics.cancelledTasks.total += 1
      }
    }
  }

  return metrics
}
