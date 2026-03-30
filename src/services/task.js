import { dbAdapter } from './dbAdapter'
import orderSubtasks from '@utils/tasks/orderSubtasks'
import { getFriendlyAuthError, getFriendlyErrorFormatted } from '@utils/getFriendlyAuthError'
import getNewPosition from '@utils/tasks/getNewPosition'

const taskService = {
  // removes a user from all assigned tasks within a specific project
  removeUserAssignments: async (uid, ownerId, projectId) => {
    if (!uid || !ownerId || !projectId)
      throw new Error('removeUserAssignments: Missing params')

    try {
      const projectRef = dbAdapter.getDocRef(
        'users',
        ownerId,
        'projects',
        projectId
      )
      const tasksRef = dbAdapter.getColRef(projectRef, 'tasks')
      const tasksSnapshot = await dbAdapter.getDocs(tasksRef)

      const batch = dbAdapter.createBatch()

      for (const taskDoc of tasksSnapshot.docs) {
        const taskData = taskDoc.data()
        // if user is assigned, remove them using arrayRemove adapter
        if (taskData.assignedTo?.includes(uid)) {
          batch.update(taskDoc.ref, {
            assignedTo: dbAdapter.removeFromArray(uid)
          })
        }
      }

      await batch.commit()
    } catch (e) {
      console.error('Task Service (removeAssignments):', e.message)
      throw getFriendlyErrorFormatted('removeUserAssignments', e.message).message
    }
  },

  subscribeToProjectTasks: ({ user, project, onUpdate, onError, onChange }) => {
    if (!user || !project) return null

    const tasksMap = new Map()
    const subtasksMap = new Map()

    let initialTasksLoaded = false
    let initialSubtasksLoaded = false

    const handleUpdate = () => {
      if (!initialTasksLoaded || !initialSubtasksLoaded) return

      const finalData = orderSubtasks(tasksMap, subtasksMap)
      onUpdate(finalData)
    }

    const filters = [
      ['projectOwner', '==', user],
      ['projectId', '==', project],
      ['isArchived', '==', false]
    ]

    const tasksQuery = dbAdapter.getGroupQuery('tasks', ...filters)
    const subtasksQuery = dbAdapter.getGroupQuery('subtasks', ...filters)

    const unsubTasks = dbAdapter.listen(tasksQuery, (snap) => {
      tasksMap.clear()

      // notify changes only after first full fetch
      if (initialTasksLoaded && onChange) {
        onChange('tasks', snap.docChanges())
      }

      for (const doc of snap.docs) {
        tasksMap.set(doc.id, { ...doc.data(), id: doc.id })
      }

      initialTasksLoaded = true
      handleUpdate()
    }, onError)

    const unsubSubtasks = dbAdapter.listen(subtasksQuery, (snap) => {
      subtasksMap.clear()

      if (initialSubtasksLoaded && onChange) {
        onChange('subtasks', snap.docChanges())
      }

      for (const doc of snap.docs) {
        // access parent task ID from the subtask path
        const taskId = doc.ref.parent.parent.id
        const subtaskData = { ...doc.data(), id: doc.id }

        if (!subtasksMap.has(taskId)) subtasksMap.set(taskId, [])
        subtasksMap.get(taskId).push(subtaskData)
      }

      initialSubtasksLoaded = true
      handleUpdate()
    }, onError)

    return () => {
      unsubTasks()
      unsubSubtasks()
    }
  },

  _getTaskRef: (ownerId, projectId, taskId, subtaskId = null) => {
    const projectRef = dbAdapter.getDocRef('users', ownerId, 'projects', projectId)
    const taskRef = dbAdapter.getDocRef(projectRef, 'tasks', taskId)

    return subtaskId
      ? dbAdapter.getDocRef(taskRef, 'subtasks', subtaskId)
      : taskRef
  },

  updateTask: async ({ ownerId, projectId, taskId, subtaskId, data }) => {
    if (!ownerId || !projectId || !taskId) throw Error('updateTask: Missing IDs')
    if (!data || Object.keys(data).length < 1) throw Error('updateTask: No data')
    if (data.createdAt) throw Error('updateTask: Cannot update createdAt')

    try {
      const ref = taskService._getTaskRef(ownerId, projectId, taskId, subtaskId)
      const isDone = data.status === 'done'
      const isCancelled = data.status === 'cancelled'
      const date = dbAdapter.getServerTimestamp()

      await dbAdapter.update(ref, {
        ...data,
        updatedAt: date,
        completedDate: isDone ? date : null,
        cancelledDate: isCancelled ? date : null
      })
    } catch (e) {
      console.error('Task Service (update):', e.message)
      throw getFriendlyErrorFormatted('updateTask', e.message).message
    }
  },

  deleteTask: async ({ ownerId, projectId, taskId, subtaskId, deleteSubtasks }) => {
    if (!ownerId || !projectId || !taskId) throw Error('deleteTask: Missing IDs')

    try {
      const taskRef = taskService._getTaskRef(ownerId, projectId, taskId)

      // delete specific subtask
      if (subtaskId) {
        const subRef = dbAdapter.getDocRef(taskRef, 'subtasks', subtaskId)
        await dbAdapter.remove(subRef)
        return
      }

      // delete task and its subtasks
      if (deleteSubtasks) {
        const subtasksCol = dbAdapter.getColRef(taskRef, 'subtasks')
        await dbAdapter.deleteCollection(subtasksCol)
        await dbAdapter.remove(taskRef)
      } else {
        await dbAdapter.remove(taskRef)
      }
    } catch (e) {
      console.error('Task Service (delete):', e.message)
      throw getFriendlyErrorFormatted('deleteTask', e.message).message
    }
  },

  createTask: async ({
    ownerId,
    projectId,
    data,
    subtaskId = null,
    lastPosition = 0
  }) => {
    if (!ownerId || !projectId || !data) throw Error('createTask: Missing params')

    try {
      let ref
      const initialPosition = lastPosition + 10000

      if (subtaskId) {
        // it's a subtask
        const parentRef = dbAdapter.getDocRef(
          'users',
          ownerId,
          'projects',
          projectId,
          'tasks',
          subtaskId
        )
        ref = dbAdapter.getColRef(parentRef, 'subtasks')
      } else {
        // it's a top-level task
        const projectRef = dbAdapter.getDocRef(
          'users',
          ownerId,
          'projects',
          projectId
        )
        ref = dbAdapter.getColRef(projectRef, 'tasks')
      }

      const timestamp = dbAdapter.getServerTimestamp()

      return await dbAdapter.add(ref, {
        ...data,
        position: data.position ?? initialPosition,
        createdAt: timestamp,
        updatedAt: timestamp,
        cancelledDate: null,
        completedBy: null,
        completedDate: null,
        cancelledBy: null,
        projectOwner: ownerId,
        projectId: projectId,
        isArchived: false,
      })
    } catch (e) {
      console.error('Task Service (create):', e.message)
      throw getFriendlyErrorFormatted('createTask', e.message).message
    }
  },

  archiveTasks: async ({ ownerId, projectId, taskIds }) => {
    try {
      const batch = dbAdapter.createBatch()
      const updatedAt = dbAdapter.getServerTimestamp()
      const projectRef = dbAdapter.getDocRef(
        'users',
        ownerId,
        'projects',
        projectId
      )

      for (const taskId of taskIds) {
        const taskRef = dbAdapter.getDocRef(projectRef, 'tasks', taskId)

        batch.update(taskRef, {
          isArchived: true,
          updatedAt,
          archivedAt: updatedAt
        })
      }

      await batch.commit()
    } catch (e) {
      console.error('Task Service (archive):', e.message)
      throw getFriendlyErrorFormatted('archiveTasks', e.message).message
    }
  },

  reorderTask: async ({
    ownerId,
    projectId,
    taskId,
    subtaskId,
    prevTaskPos,
    nextTaskPos,
    newStatus
  }) => {
    if (!ownerId || !projectId || !taskId) throw Error('reorderTask: Missing IDs')

    try {
      const newPos = getNewPosition(prevTaskPos, nextTaskPos)
      const ref = taskService._getTaskRef(ownerId, projectId, taskId, subtaskId)

      const updates = {
        position: newPos,
        updatedAt: dbAdapter.getServerTimestamp()
      }

      // if moving between columns in Kanban, update status and metadata as well
      if (newStatus) {
        updates.status = newStatus

        const isDone = newStatus === 'done'
        const isCanc = newStatus === 'cancelled'

        if (isDone || isCanc) {
          updates.completedDate = isDone ? dbAdapter.getServerTimestamp() : null
          updates.cancelledDate = isCanc ? dbAdapter.getServerTimestamp() : null
        }
      }

      await dbAdapter.update(ref, updates)
      return newPos
    } catch (e) {
      console.error('Task Service (reorder):', e.message)
      throw getFriendlyErrorFormatted('reorderTask', e.message).message
    }
  },

  moveSubtasks: async function ({ user, task, subtasks, project, position }) {
    if (!user || !project) throw Error('moveSubtasks: Invalid user or project')

    try {
      const tasksCol = dbAdapter.getColRef('users', user, 'projects', project, 'tasks')
      const timestamp = dbAdapter.getServerTimestamp()
      const batch = dbAdapter.createBatch()

      for (const task of subtasks) {
        const taskRef = dbAdapter.getDocRef(tasksCol)
        const { id, subtask, isSubtask, status, ref, createdAt, ...other } = task

        const newData = {
          ...other,
          status: 'todo',
          isSubtask: false,
          subtask: null,
          id: taskRef.id,
          position,
          createdAt: timestamp,
          updatedAt: timestamp
        }

        batch.set(taskRef, newData)

        // delete the original subtask
        batch.delete(dbAdapter.getDocRef(tasksCol, id))
      }

      // delete the parent task
      batch.delete(dbAdapter.getDocRef(tasksCol, task))

      await batch.commit()
    } catch (e) {
      console.error('Task Service (move subtasks):', e.message)
      throw getFriendlyErrorFormatted('move subtasks', e.message).message
    }
  }
}

export default taskService
