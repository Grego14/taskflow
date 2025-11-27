import db from '@/db'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import { doc, updateDoc } from 'firebase/firestore'

export default async function updateTask({
  user,
  project,
  task,
  data,
  subtask
}) {
  if (!user || typeof user !== 'string')
    throw Error('updateTask error: Invalid user id')

  if (!project || typeof project !== 'string')
    throw Error('updateTask error: Invalid project id')

  if (!task || typeof task !== 'string')
    throw Error('updateTask error: Invalid task id')

  if (!data || typeof data !== 'object' || Object.keys(data).length < 1)
    throw Error('updateTask error: No task data provided!')

  if (data.createdAt)
    throw Error('updateTask error: Updating createdAt field is not allowed!')

  try {
    let taskRef = doc(db, 'users', user, 'projects', project, 'tasks', task)

    if (subtask) {
      taskRef = doc(taskRef, 'subtasks', subtask)
    }

    await updateDoc(taskRef, data)
  } catch (error) {
    console.error(error)
    throw getFriendlyAuthError(error.message).message
  }
}
