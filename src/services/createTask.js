import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import db from '@/db'

/**
 * Creates a project task.
 *
 * @param {Object} params - object with 3 required params and 1 optional
 * @param {string} params.user - ID of the user.
 * @param {string} params.project - ID of the project.
 * @param {string} params.data - Data of the task.
 * @param {boolean} params.subtask - True if the task to create is a subtask.
 * @throws {object} - A getFriendlyAuthError object if the data is not found.
 */
export default async function createTask(params) {
  const {
    user,
    project,
    data,
    subtask = false,
    isUndoingRemoval = false
  } = params

  if (!user || typeof user !== 'string')
    throw Error('createTask error: Invalid user id')

  if (!project || typeof project !== 'string')
    throw Error('createTask error: Invalid project id')

  if (!data || typeof data !== 'object' || Object.keys(data).length < 1)
    throw Error('createTask error: No task data provided!')

  if (subtask && !data.subtask)
    throw Error(
      'createTask error: Invalid task id. data.subtask needs to be an id of a parent task to be able to create a subtask'
    )

  const taskData = {
    ...data,
    // if the user undos a task removal we use the same task date
    createdAt: isUndoingRemoval ? data?.createdAt : serverTimestamp(),
    createdBy: user,
    subtask: data?.subtask || null,
    isSubtask: subtask,
    projectOwner: user,
    projectId: project,
    isArchived: false
  }

  try {
    const tasksCol = collection(db, 'users', user, 'projects', project, 'tasks')
    const taskRef = doc(tasksCol)

    if (!subtask) {
      await setDoc(taskRef, taskData)
    } else {
      const subtasksCol = collection(tasksCol, data.subtask, 'subtasks')
      const subtaskRef = doc(subtasksCol)

      await setDoc(subtaskRef, taskData)
    }
  } catch (err) {
    console.error(err)
    throw getFriendlyAuthError(err.message).message
  }

  return taskData
}
