import i18n from '@/i18n'
import { dbAdapter } from './dbAdapter'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import orderSubtasks from '@utils/tasks/orderSubtasks'

const metricsService = {
  getProjectTasksForMetrics: async ({
    owner,
    project,
    onUpdate,
    startDate = null,
    endDate = null
  }) => {
    if (!project || !owner) throw Error('getProjectTasksForMetrics: Invalid params')

    const filters = [
      ['projectId', '==', project],
      ['projectOwner', '==', owner]
    ]

    if (startDate) filters.push(['createdAt', '>=', startDate])
    if (endDate) filters.push(['createdAt', '<=', endDate])

    try {
      const tasksQuery = dbAdapter.getGroupQuery('tasks', ...filters)
      const subtasksQuery = dbAdapter.getGroupQuery('subtasks', ...filters)

      const [tasksSnapshot, subtasksSnapshot] = await Promise.all([
        dbAdapter.getDocs(tasksQuery),
        dbAdapter.getDocs(subtasksQuery)
      ])

      const tasksMap = new Map()
      const subtasksMap = new Map()

      // get tasks
      for (const doc of tasksSnapshot.docs) {
        tasksMap.set(doc.id, { ...doc.data(), id: doc.id })
      }

      // get subtasks
      for (const doc of subtasksSnapshot.docs) {
        const taskId = doc.ref.parent.parent.id
        const subtaskData = { ...doc.data(), id: doc.id }

        if (!subtasksMap.has(taskId)) {
          subtasksMap.set(taskId, [])
        }
        subtasksMap.get(taskId).push(subtaskData)
      }

      const finalTasks = orderSubtasks(tasksMap, subtasksMap)
      onUpdate(finalTasks)
    } catch (err) {
      console.error('getProjectTasksForMetrics:', err)
      throw getFriendlyErrorFormatted(
        'getProjectTasksForMetrics',
        err.message,
        i18n.language
      )
    }
  }
}

export default metricsService
