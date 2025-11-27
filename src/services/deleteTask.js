import db from '@/db'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError.js'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch
} from 'firebase/firestore'

export default async function deleteTask(
  { user, project, task, subtask, deleteSubtasks } = {
    subtask: null,
    deleteSubtasks: false
  }
) {
  if (!user || !project || !task)
    throw Error('deleteTask error: Invalid params.')

  try {
    const taskRef = doc(db, 'users', user, 'projects', project, 'tasks', task)

    if (subtask) {
      const subtaskRef = doc(taskRef, 'subtasks', subtask)
      await deleteDoc(subtaskRef)
      return
    }

    if (deleteSubtasks) {
      const batch = writeBatch(db)
      const subtasksSnapshot = await getDocs(collection(taskRef, 'subtasks'))
      const containsSubtasks = !subtasksSnapshot.empty
      const subtasks = subtasksSnapshot.docs.map(doc => doc.ref)

      if (!containsSubtasks) {
        await deleteDoc(taskRef)
        return
      }

      for (const task of subtasks) {
        batch.delete(task)
      }

      batch.delete(taskRef)
      await batch.commit()
    } else {
      await deleteDoc(taskRef)
    }
  } catch (err) {
    console.error(err)
    throw getFriendlyErrorFormatted('deleteTask', err.message).message
  }
}
