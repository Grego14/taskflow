import db from '@/db'
import i18n from '@/i18n'
import deleteCollection from '@utils/deleteCollection'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'

export default async function removeProject({ user, project }) {
  if (
    !user ||
    typeof user !== 'string' ||
    !project ||
    typeof project !== 'string'
  )
    throw Error('removeProject: Invalid params')

  try {
    const projectRef = doc(db, 'users', user, 'projects', project)

    const tasksColRef = collection(projectRef, 'tasks')
    const tasksSnapshot = await getDocs(tasksColRef)

    const taskDeletionPromises = []

    for (const taskDoc of tasksSnapshot.docs) {
      // reference the sub-tasks sub-collection for the current task
      const subtasksColRef = collection(taskDoc.ref, 'subtasks')

      // create a promise to delete all sub-tasks
      const deleteSubtasksPromise = deleteCollection(subtasksColRef)
      taskDeletionPromises.push(deleteSubtasksPromise)

      // create a promise to delete the task itself (after sub-tasks are handled)
      const deleteTaskPromise = deleteDoc(taskDoc.ref)
      taskDeletionPromises.push(deleteTaskPromise)
    }

    await Promise.all(taskDeletionPromises)
    await deleteDoc(projectRef)
  } catch (err) {
    console.error(err)
    throw getFriendlyAuthError(err.message, i18n.language)
  }
}
