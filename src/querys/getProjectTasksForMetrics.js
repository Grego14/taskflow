import db from '@/db'
import i18n from '@/i18n'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import orderSubtasks from '@utils/tasks/orderSubtasks'
import { collectionGroup, getDocs, query, where } from 'firebase/firestore'

export default async function getProjectTasksForMetrics({
  owner,
  project,
  onError,
  onUpdate
}) {
  const tasksMap = new Map()
  const subtasksMap = new Map()

  const tasksQuery = query(
    collectionGroup(db, 'tasks'),
    where('projectId', '==', project),
    where('projectOwner', '==', owner)
  )

  const subtasksQuery = query(
    collectionGroup(db, 'subtasks'),
    where('projectId', '==', project),
    where('projectOwner', '==', owner)
  )

  const updateTasks = () => {
    const finalTasks = orderSubtasks(tasksMap, subtasksMap)
    onUpdate(finalTasks)
  }

  try {
    const tasksSnapshot = await getDocs(tasksQuery)
    const subtasksSnapshot = await getDocs(subtasksQuery)

    const tasksExists = !tasksSnapshot.empty
    const subtasksExists = !subtasksSnapshot.empty

    if (tasksExists) {
      for (const doc of tasksSnapshot.docs) {
        tasksMap.set(doc.id, { ...doc.data(), id: doc.id })
      }

      updateTasks()
    }

    if (subtasksExists) {
      for (const doc of subtasksSnapshot.docs) {
        const taskRef = doc.ref.parent.parent
        const taskId = taskRef.id

        const subtaskData = { ...doc.data(), id: doc.id }

        if (!subtasksMap.has(taskId)) {
          subtasksMap.set(taskId, [])
        }
        subtasksMap.get(taskId).push(subtaskData)
      }

      updateTasks()
    }
  } catch (err) {
    console.error(err)
    throw getFriendlyErrorFormatted(
      'getProjectTasksForMetrics',
      err.message,
      i18n.language
    )
  }
}
