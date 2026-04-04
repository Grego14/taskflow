import { useMemo, useRef, useCallback, useEffect } from 'preact/hooks'
import useLayout from '@hooks/useLayout'

import getTaskRef from '@utils/tasks/getTaskRef'
import { playSound } from '@services/audio'

import TasksContext from './context'
import {
  globalClock,
  activeTaskData,
  pomoStart,
  targetTime,
  showOverlay,
  isWorking,
  clearFocusGoals
} from '@stores/task'

export default function TasksBaseProvider({
  children,
  tasks,
  actions,
  loading,
  error,
  taskRefs // [taskId]: DOMElement
}) {
  const { isPreview } = useLayout()
  const timeout = useRef(null)

  const toggleWorkingTask = useCallback((taskData = null) => {
    const dataValue = activeTaskData.value

    // if there's an active task, we save it (the user paused it or switches to
    // another task while already having an active task)
    if (dataValue) {
      const { id, subtask, startTime, initialSeconds } = dataValue

      clearFocusGoals()

      actions.saveWorkingTime({
        id,
        parent: subtask,
        startTime,
        initialSeconds
      })

      // if there's no new task (taskData.id is null) or is the same task,
      // reset and close
      if (!taskData?.id || dataValue.id === taskData.id) {
        showOverlay.value = false
        activeTaskData.value = null
        return
      }
    }

    // activate work mode to a new task
    if (taskData?.id) {
      const { id, title, priority, subtask, workedTime } = taskData
      let parentTitle = null

      showOverlay.value = true

      // get the parent task title if the task is a subtask
      if (subtask) {
        for (const task of tasks) {
          if (task.id === subtask) {
            parentTitle = task.title
            break
          }
        }
      }

      activeTaskData.value = {
        id,
        title,
        priority,
        subtask,
        parentTitle,
        startTime: Date.now(),
        initialSeconds: workedTime || 0
      }
    }
  }, [actions, tasks])

  const scrollIntoTask = useCallback((taskId) => {
    const element = getTaskRef(taskRefs, taskId)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })

      clearTimeout(timeout.current)
      element.setAttribute('data-focused', true)
      timeout.current = setTimeout(() => {
        element.removeAttribute('data-focused')
      }, 1500)
    }
  }, [])

  const value = useMemo(() => ({
    tasks,
    actions,
    loading: !isPreview ? loading : false,
    error: !isPreview ? error : null,
    taskRefs,
    scrollIntoTask,
    toggleWorkingTask
  }), [tasks, actions, loading, error, scrollIntoTask, toggleWorkingTask])

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}
