import db from '@/db'
import i18n from '@/i18n'
import deleteCollection from '@utils/deleteCollection'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch
} from 'firebase/firestore'

export default async function deleteUser(user) {
  if (!user || typeof user !== 'string')
    throw Error('deleteUser: Invalid user param')

  try {
    const batch = writeBatch(db)
    const userRef = doc(db, 'users', user)
    const projectsCol = collection(userRef, 'projects')

    const projectsSnap = await getDocs(projectsCol)

    // delete the projects, projects drawer data, project tasks and subtasks
    for (const project of projectsSnap.docs.map(project => ({
      id: project.id,
      ref: project.ref
    }))) {
      // avoid getting tasks if the project is a drawer data
      if (project.id.match('drawer')) {
        batch.delete(project.ref)
        continue
      }

      const tasksColRef = collection(project.ref, 'tasks')
      const tasksSnapshot = await getDocs(tasksColRef)

      // delete the tasks and subtasks of the project
      for (const taskDoc of tasksSnapshot.docs) {
        const subtasksColRef = collection(taskDoc.ref, 'subtasks')

        // delete the task subtasks (this method internally uses batch)
        await deleteCollection(subtasksColRef)
        // delete the task
        batch.delete(taskDoc.ref)
      }

      batch.delete(project.ref)
    }

    const notificationsCol = collection(userRef, 'notifications')
    const notificationsSnap = await getDocs(notificationsCol)

    for (const notification of notificationsSnap.docs) {
      batch.delete(notification.ref)
    }

    await batch.commit()
    await deleteDoc(userRef)
  } catch (err) {
    console.error(err)
    throw getFriendlyAuthError(err.message, i18n.language)
  }
}
