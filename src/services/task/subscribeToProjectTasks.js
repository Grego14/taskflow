import { dbAdapter } from '../dbAdapter.js'
import orderSubtasks from '@utils/tasks/orderSubtasks'

/** 
 * @param {string} user - project owner id
 * @param {string} project - project id
 * @param {string} onUpdate - called on the initial load and when there's a change
 * @param {string} onError - called when there's an error
 * @param {string} onChange - called after the initial load and when there's a
 * document change
 *
 * subscribe to a project task and subtasks documents
*/
export default function subscribeToProjectTasks({ 
  user, 
  project, 
  onUpdate, 
  onError, 
  onChange
}) {
  if (!user || !project) return null

  const tasksMap = new Map()
  const subtasksMap = new Map()

  let initialTasksLoaded = false
  let initialSubtasksLoaded = false

  const handleUpdate = () => {
    // notify changes only after first full fetch
    if (!initialTasksLoaded || !initialSubtasksLoaded) return
    onUpdate(orderSubtasks(tasksMap, subtasksMap))
  }

  const filters = [
    ['projectOwner', '==', user],
    ['projectId', '==', project],
    ['isArchived', '==', false]
  ]

  const tasksQuery = dbAdapter.getGroupQuery('tasks', ...filters)
  const subtasksQuery = dbAdapter.getGroupQuery('subtasks', ...filters)

  const unsubTasks = dbAdapter.listen(tasksQuery, (snap) => {
    tasksMap.clear()

    if (initialTasksLoaded && onChange) onChange('tasks', snap.docChanges())

    for (const doc of snap.docs) {
      tasksMap.set(doc.id, { ...doc.data(), id: doc.id })
    }

    initialTasksLoaded = true
    handleUpdate()
  }, onError)

  const unsubSubtasks = dbAdapter.listen(subtasksQuery, (snap) => {
    subtasksMap.clear()

    if (initialSubtasksLoaded && onChange) 
      onChange('subtasks', snap.docChanges())

    for (const doc of snap.docs) {
      // access parent task ID from the subtask path
      const taskId = doc.ref.parent.parent.id
      const subtaskData = { ...doc.data(), id: doc.id }

      if (!subtasksMap.has(taskId)) subtasksMap.set(taskId, [])
      subtasksMap.get(taskId).push(subtaskData)
    }

    initialSubtasksLoaded = true
    handleUpdate()
  }, onError)

  return () => {
    unsubTasks()
    unsubSubtasks()
  }
}
