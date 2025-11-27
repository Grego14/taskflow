import orderSubtasks from '@utils/tasks/orderSubtasks'
import { collectionGroup, onSnapshot, query, where } from 'firebase/firestore'
import db from '@/db'

export default function getProjectTasks({
  user,
  project,
  onError,
  onUpdate,
  onChange
}) {
  if (!user || !project) return null

  const tasksMap = new Map()
  const subtasksMap = new Map()

  let tasksFetched = false
  let initialTasksFetch = false

  let subtasksFetched = false
  let initialSubtasksFetch = false

  const updateCombinedData = () => {
    if (tasksFetched || subtasksFetched) {
      const finalData = orderSubtasks(tasksMap, subtasksMap)
      onUpdate(finalData)

      return finalData
    }
  }

  try {
    const tasksQuery = query(
      collectionGroup(db, 'tasks'),
      where('projectOwner', '==', user),
      where('projectId', '==', project),
      where('isArchived', '==', false)
    )
    const subtasksQuery = query(
      collectionGroup(db, 'subtasks'),
      where('projectOwner', '==', user),
      where('projectId', '==', project),
      where('isArchived', '==', false)
    )

    // get the tasks
    const unsubscribeTasks = onSnapshot(
      tasksQuery,
      tasksSnap => {
        tasksMap.clear()

        // the initial snapshot changes are type "added" so we don't call the
        // onChange callback
        if (initialTasksFetch) onChange('tasks', tasksSnap.docChanges())

        for (const doc of tasksSnap.docs) {
          tasksMap.set(doc.id, { ...doc.data(), id: doc.id })
          initialTasksFetch = true
        }

        tasksFetched = true
        updateCombinedData()
      },
      err => console.error('tasks', err)
    )

    // get the subtasks
    const unsubscribeSubtasks = onSnapshot(
      subtasksQuery,
      subtasksSnap => {
        subtasksMap.clear()

        // same as the onChange inside the unsubscribeTasks
        if (initialSubtasksFetch)
          onChange('subtasks', subtasksSnap.docChanges())

        for (const doc of subtasksSnap.docs) {
          const taskRef = doc.ref.parent.parent
          const taskId = taskRef.id

          const subtaskData = { ...doc.data(), id: doc.id }

          if (!subtasksMap.has(taskId)) {
            subtasksMap.set(taskId, [])
          }
          subtasksMap.get(taskId).push(subtaskData)

          initialSubtasksFetch = true
        }

        subtasksFetched = true
        updateCombinedData()
      },
      err => console.error('subtasks', err)
    )

    return () => {
      unsubscribeTasks()
      unsubscribeSubtasks()
      console.log(
        '--- Unsubscribing from project tasks and subtasks snapshots ---'
      )
    }
  } catch (err) {
    console.error('getProjectTask:', err.message)
  }
}
