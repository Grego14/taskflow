import ContainSubtasks from './components/ContainSubtasks'
import TaskActionsContext from './context'

import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { useCallback, useMemo, useRef, useState } from 'react'
import useTasks from '../../hooks/useTasks'

import { priorities } from '@/constants'
import formatTimestamp from '@utils/formatTimestamp'
import getTaskMetadata from '@utils/tasks/getTaskMetadata'
import { getSubtasks, getTaskWithId, isSubtask } from './utils'

import lazyImport from '@utils/lazyImport'
import { serverTimestamp } from 'firebase/firestore'

export default function TaskActionsProvider({ children }) {
  const { updateLastActive, uid } = useUser()
  const { data, id: projectId, isArchived } = useProject()
  const { actions, tasks } = useTasks()
  const [showContainSubtasksMenu, setShowContainSubtasksMenu] = useState(false)
  const [dialogProps, setDialogProps] = useState(null)
  const deleteAllSubtasks = useRef(false)

  // swap between done and todo
  const updateStatus = useCallback(
    (e, nextStatus) => {
      // the e can also be an object with the properties
      const { taskId, isSubtask, parentId, checked } = e?.target
        ? getTaskMetadata(e.target)
        : e

      if (!taskId || isArchived) return

      let taskData = tasks?.find(
        task => task.id === (isSubtask ? parentId : taskId)
      )

      if (isSubtask) {
        taskData = taskData.subtasks.find(subtask => subtask.id === taskId)
      }

      const isChecked = checked || e?.target?.checked
      ;(async () => {
        // listen for task changes and wait for the completedDate timestamp to
        // update (this function updates the task field "wasOnTime")
        const waitForCompletedDate = await lazyImport(
          '/src/services/waitForCompletedDate'
        )

        // dueDate can be null as tasks can have indeterminate dueDates
        if (isChecked && taskData?.dueDate) {
          const dueDate = formatTimestamp(taskData.dueDate)?.raw

          waitForCompletedDate({
            taskId,
            parentId,
            isSubtask,
            project: projectId,
            owner: data?.createdBy,
            dueDate
          })
        }

        await actions.updateTask({
          id: isSubtask ? parentId : taskId,
          data: {
            status: nextStatus,
            completedDate: nextStatus === 'done' ? serverTimestamp() : null,
            completedBy: nextStatus === 'done' ? uid : null,
            cancelledDate:
              nextStatus === 'cancelled' ? serverTimestamp() : null,
            cancelledBy: nextStatus === 'cancelled' ? uid : null,
            // wasOnTime is only valid if the task status is changing to 'done'
            ...(nextStatus === 'todo' ||
              (nextStatus === 'cancelled' && { wasOnTime: null }))
          },
          subtask: isSubtask ? taskId : null
        })
      })()
    },
    [actions?.updateTask, isArchived, tasks, projectId, data?.createdBy, uid]
  )

  const deleteTask = useCallback(
    e => {
      const { taskId, isSubtask, parentId } = getTaskMetadata(e.target)

      if (!taskId || !e?.target || isArchived) return

      const taskData = getTaskWithId(
        isSubtask ? getSubtasks(tasks) : tasks,
        taskId
      )

      const areSubtasksChecked =
        deleteAllSubtasks?.current ||
        // can only delete the subtasks if the task is not a subtask
        // without this, if all the subtasks of a task are checked and not the
        // parent task the task will be also deleted
        (!isSubtask &&
          // ...
          getSubtasks(tasks, parentId || taskId)?.every(
            subtask =>
              subtask.status === 'done' || subtask.status === 'cancelled'
          ))

      // areSubtasksChecked is always true if the task doens't contains subtasks
      // so if the task is not a subtask and areSubtasksChecked is false we
      // return
      if (!isSubtask && !areSubtasksChecked) {
        setShowContainSubtasksMenu(true)
        setDialogProps({ taskId, isSubtask, parentId })
        return
      }
      ;(async () => {
        await actions.deleteTask({
          id: isSubtask ? taskData?.subtask : taskId,
          subtask: isSubtask ? taskId : null,
          deleteSubtasks: areSubtasksChecked
        })

        setShowContainSubtasksMenu(false)
      })()
    },
    [tasks, actions?.deleteTask, isArchived]
  )

  const updatePriority = useCallback(
    e => {
      const { taskId, isSubtask, parentId } = getTaskMetadata(e.target)

      // if the user somehow change the id of the element the value will
      // be 'none'
      const getPriority = priority =>
        !priorities.includes(priority) ? 'none' : priority

      const value = getPriority(e.target.id?.replace('menu__', ''))

      if (!taskId || (isSubtask && !parentId) || isArchived) return
      ;(async () => {
        await actions.updateTask({
          id: isSubtask ? parentId : taskId,
          subtask: isSubtask ? taskId : null,
          data: { priority: value }
        })
      })()
    },
    [actions?.updateTask, isArchived]
  )

  const archiveTask = useCallback(
    e => {
      const { taskId, isSubtask, parentId } = getTaskMetadata(e.target)

      if (!taskId || (isSubtask && !parentId) || isArchived) return
      ;(async () => {
        await actions.updateTask({
          id: isSubtask ? parentId : taskId,
          subtask: isSubtask ? taskId : null,
          data: { isArchived: true }
        })
      })()
    },
    [isArchived, actions?.updateTask]
  )

  const value = useMemo(
    () => ({ updateStatus, deleteTask, updatePriority, archiveTask }),
    [updateStatus, deleteTask, updatePriority, archiveTask]
  )

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
