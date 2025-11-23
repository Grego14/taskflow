import { db } from '@/firebase/firebase-config'
import i18n from '@/i18n'
import { getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import {
  arrayRemove,
  collectionGroup,
  doc,
  getDocs,
  query,
  where,
  writeBatch
} from 'firebase/firestore'

export default async function removeAssignedTasksToUser(user, project, owner) {
  try {
    const tasksQuery = query(
      collectionGroup(db, 'tasks'),
      where('assignedTo', 'array-contains', user),
      where('projectOwner', '==', owner),
      where('projectId', '==', project)
    )
    const subtasksQuery = query(
      collectionGroup(db, 'subtasks'),
      where('assignedTo', 'array-contains', user),
      where('projectOwner', '==', owner),
      where('projectId', '==', project)
    )

    const tasksSnapshot = await getDocs(tasksQuery)
    const subtasksSnapshot = await getDocs(subtasksQuery)
    const tasks = tasksSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    const subtasks = subtasksSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }))

    const batch = writeBatch(db)

    const tasksIds = tasks.map(task => ({
      id: task.id,
      isArchived: task.isArchived,
      completedBy: task.completedBy,
      cancelledBy: task.cancelledBy
    }))
    const subtasksIds = subtasks.map(subtask => ({
      id: subtask.id,
      parent: subtask.subtask,
      isArchived: subtask.isArchived,
      completedBy: subtask.completedBy,
      cancelledBy: subtask.cancelledBy
    }))

    for (const task of tasksIds) {
      const taskDoc = doc(
        db,
        'users',
        owner,
        'projects',
        project,
        'tasks',
        task.id
      )

      if (
        !task.isArchived ||
        (task.completedBy !== user && task.cancelledBy !== user)
      ) {
        batch.update(taskDoc, { assignedTo: arrayRemove(user) })
      }
    }

    for (const subtask of subtasksIds) {
      const taskDoc = doc(
        db,
        'users',
        owner,
        'projects',
        project,
        'tasks',
        subtask.parent,
        'subtasks',
        subtask.id
      )

      if (
        !subtask.isArchived ||
        (subtask.completedBy !== user && subtask.cancelledBy !== user)
      ) {
        batch.update(taskDoc, { assignedTo: arrayRemove(user) })
      }
    }

    await batch.commit()
  } catch (err) {
    console.error(err)
    throw getFriendlyErrorFormatted(
      'removeAssignedTasksToUser',
      err.message,
      i18n.language
    )
  }
}
