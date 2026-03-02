import { useCallback, useMemo, useRef, useState } from 'react'
import TaskActionsContext from './context'
import ContainSubtasks from './components/ContainSubtasks'

import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import useTasks from '@hooks/useTasks'

import { priorities } from '@/constants'
import getTaskMetadata from '@utils/tasks/getTaskMetadata'
import { getSubtasks, getTaskWithId } from './utils'

import taskService from '@services/task'

const resolveTaskInfo = (input) => {
  const meta = input?.target ? getTaskMetadata(input.target) : input

  return {
    taskId: meta?.id,
    isSub: !!meta?.isSubtask || typeof meta?.subtask === 'string',
    parent: meta?.subtask,
    checked: meta?.checked || input?.target?.checked
  }
}

export default function TaskActionsProvider({ children }) {
  const { uid } = useUser()
  const { data: projectData, id: projectId, isArchived } = useProject()
  const { actions, tasks, getTaskData } = useTasks()

  const [showContainSubtasksMenu, setShowContainSubtasksMenu] = useState(false)
  const [dialogProps, setDialogProps] = useState(null)
  const deleteAllSubtasks = useRef(false)

  // swap between done, todo and cancelled
  const updateStatus = useCallback(async (data, nextStatus) => {
    const { checked, taskId, isSub, parent } = resolveTaskInfo(data)

    if (!taskId || isArchived) return

    const isDone = nextStatus === 'done'
    const isCanc = nextStatus === 'cancelled'

    let wasOnTime = null
    if (isDone) {
      let taskData = tasks?.find(t => t.id === (isSub ? parent : taskId))
      if (isSub) taskData = taskData?.subtasks?.find(s => s.id === taskId)

      if (taskData?.dueDate) {
        wasOnTime = new Date() <= new Date(taskData.dueDate)
      }
    }

    actions.updateTask({
      id: isSub ? parent : taskId,
      subtask: isSub ? taskId : null,
      data: {
        status: nextStatus,
        completedBy: isDone ? uid : null,
        cancelledBy: isCanc ? uid : null,
        ...(nextStatus === 'todo' || (isCanc && { wasOnTime: null }))
      }
    })

    actions.updateTask({
      id: isSub ? parent : taskId,
      subtask: isSub ? taskId : null,
      data: {
        status: nextStatus,
        completedBy: isDone ? uid : null,
        cancelledBy: isCanc ? uid : null,
        wasOnTime,
        ...(nextStatus === 'todo' && {
          wasOnTime: null,
          completedBy: null,
          cancelledBy: null
        })
      }
    })
  }, [actions, isArchived, tasks, projectId, projectData?.createdBy, uid, resolveTaskInfo])

  const deleteTask = useCallback(async (e) => {
    const { taskId, isSub, parent } = resolveTaskInfo(e)

    if (!taskId || isArchived) return

    const taskData = getTaskWithId(isSub ? getSubtasks(tasks) : tasks, taskId)
    const hasPendingSubtasks = !isSub && getSubtasks(tasks, parent || taskId)?.some(
      s => s.status !== 'done' && s.status !== 'cancelled'
    )

    const shouldDeleteAll = deleteAllSubtasks.current || !hasPendingSubtasks

    if (!isSub && hasPendingSubtasks && !deleteAllSubtasks.current) {
      setDialogProps({ taskId, isSubtask: isSub, parentId: parent })
      setShowContainSubtasksMenu(true)
      return
    }

    await actions.deleteTask({
      id: isSub ? taskData?.subtask : taskId,
      subtask: isSub ? taskId : null,
      deleteSubtasks: shouldDeleteAll
    })
    setShowContainSubtasksMenu(false)
  }, [tasks, actions, isArchived, resolveTaskInfo])

  const value = useMemo(() =>
    ({ updateStatus, deleteTask })
    , [updateStatus, deleteTask])

  return (
    <TaskActionsContext.Provider value={value}>
      {showContainSubtasksMenu && (
        <ContainSubtasks
          open={showContainSubtasksMenu}
          close={() => setShowContainSubtasksMenu(false)}
          {...dialogProps}
        />
      )}
      {children}
    </TaskActionsContext.Provider>
  )
}
