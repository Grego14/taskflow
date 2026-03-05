import formatTimestamp from '@utils/formatTimestamp'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import getMetricPeriod from './getMetricPeriod'
import getMetricsToUpdate from './getMetricsToUpdate'

const INITIAL_PERIODS = {
  total: 0,
  today: 0,
  yesterday: 0,
  lastWeek: 0,
  thisWeek: 0,
  thisMonth: 0
}

const createMetricObj = () => ({ ...INITIAL_PERIODS })

export default function getMetrics(tasks) {
  if (!tasks?.length) return null

  const metrics = {
    pendingTasks: 0,
    overdueTasks: 0,
    completedTasks: createMetricObj(),
    completedOnTime: createMetricObj(),
    cancelledTasks: createMetricObj()
  }

  const allItems = tasks.reduce((acc, task) => {
    acc.push(task)
    if (task.subtasks?.length) {
      for (const subtask of task.subtasks) acc.push(subtask)
    }
    return acc
  }, [])

  for (const item of allItems) {
    const { status, wasOnTime, dueDate, completedDate, cancelledDate } = item
    const isDone = status === 'done'
    const isCancelled = status === 'cancelled'

    // overdue & pending
    if (dueDate && !isDone && !isCancelled) {
      taskIsOverdue(item) ? metrics.overdueTasks++ : metrics.pendingTasks++
      continue
    }

    // completed & completed on time & cancelled
    if ((isDone && completedDate) || (isCancelled && cancelledDate)) {
      const timestamp = isDone ? completedDate : cancelledDate
      const rawDate = formatTimestamp(timestamp).raw

      const period = getMetricPeriod(rawDate)

      if (!period) continueR

      const target = isDone ? metrics.completedTasks : metrics.cancelledTasks
      const periodsToUpdate = getMetricsToUpdate(period)

      for (const field of periodsToUpdate) {
        target[field]++
        if (isDone && wasOnTime) metrics.completedOnTime[field]++
      }

      target.total++
      if (isDone && wasOnTime) metrics.completedOnTime.total++
    }
  }

  return metrics
}
