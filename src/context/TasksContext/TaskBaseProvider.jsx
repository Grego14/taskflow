import { useMemo, useRef, useCallback } from 'preact/hooks'
import useLayout from '@hooks/useLayout'
import getTaskRef from '@utils/tasks/getTaskRef'

import TasksContext from './context'

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
    scrollIntoTask
  }), [tasks, actions, loading, error, scrollIntoTask])

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}
