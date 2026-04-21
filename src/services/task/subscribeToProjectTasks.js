import { dbAdapter } from '../dbAdapter.js'

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

  const rawRegistry = new Map()
  let tasksLoaded = false
  let subtasksLoaded = false

  const emit = () => {
    // notify changes only after first full fetch
    if (!tasksLoaded || !subtasksLoaded) return
    onUpdate(Array.from(rawRegistry.values()))
  }

  const filters = [
    ['projectOwner', '==', user],
    ['projectId', '==', project],
    ['isArchived', '==', false]
  ]

  const unsubTasks = dbAdapter.listen(
    dbAdapter.getGroupQuery('tasks', ...filters), 
    (snap) => {

    if (tasksLoaded && onChange) onChange('tasks', snap.docChanges())

    for (const doc of snap.docs) {
      const data = doc.data()
      rawRegistry.set(doc.id, { ...data, id: doc.id })
    }

    tasksLoaded = true
    emit()
  }, onError)

  const unsubSubtasks = dbAdapter.listen(
    dbAdapter.getGroupQuery('subtasks', ...filters), 
    (snap) => {

    if (subtasksLoaded && onChange)
      onChange('subtasks', snap.docChanges())

    for (const doc of snap.docs) {
      const parentId = doc.ref.parent.parent.id
      rawRegistry.set(doc.id, { ...doc.data(), id: doc.id, parentId })
    }

    subtasksLoaded = true
    emit()
  }, onError)

  return () => { unsubTasks(); unsubSubtasks() }
}
