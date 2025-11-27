import i18n from '@/i18n.js'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import { collection, doc, writeBatch } from 'firebase/firestore'
import db from '@/db'

const getNewDate = () => {
  const dueDate = new Date()
  // set the time to the last hour of the day
  dueDate.setHours(23)
  dueDate.setMinutes(59)

  return dueDate.toISOString()
}

export default async function moveSubtasks({ user, task, tasks, project }) {
  if (!user || !project) throw Error('moveSubtasks: Invalid user or project')

  try {
    const tasksCol = collection(db, 'users', user, 'projects', project, 'tasks')
    const batch = writeBatch(db)

    for (const task of tasks) {
      const taskRef = doc(tasksCol)
      const { id, subtask, isSubtask, status, dueDate, ...other } = task

      const newData = {
        ...other,
        dueDate: getNewDate(),
        status: 'todo',
        isSubtask: false,
        subtask: null,
        id: taskRef.id
      }

      batch.set(taskRef, newData)

      // delete the original subtask
      batch.delete(doc(tasksCol, id))
    }

    // delete the parent taks
    batch.delete(doc(tasksCol, task))

    await batch.commit()
  } catch (err) {
    console.error(err)
    throw getFriendlyErrorFormatted('moveTasks', err.message, i18n.language)
  }
}
