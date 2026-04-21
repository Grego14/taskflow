import { useMemo, useRef, useCallback, useEffect } from 'preact/hooks'
import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'

import getTaskRef from '@utils/tasks/getTaskRef'

import { setGlobalAlert } from '@stores/ui'

import TasksContext from './context'
import useTaskActions from './hooks/useTaskActions'

export default function TasksBaseProvider({
  children,
  loading,
  error,
  taskRefs, // [taskId]: DOMElement
  retry
}) {
  const timeout = useRef(null)

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

  const setTaskRef = useCallback((id, el) => {
    if (el) taskRefs.current[id] = el
    else delete taskRefs.current[id]
  }, [])

  useEffect(() => () => clearTimeout(timeout.current), [])

  const actions = useTaskActions(taskRefs)

  const value = useMemo(() => ({
    actions, 
    loading,
    error,
    taskRefs,
    scrollIntoTask,
    toggleWorkingTask: actions.toggleWorkingTask,
    setTaskRef,
    retry
  }), [actions, loading, error, scrollIntoTask])

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}
