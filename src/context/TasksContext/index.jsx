import { memo, useMemo, useRef } from 'preact/compat'

import useProject from '@hooks/useProject'
import useProjectTasks from './hooks/useProjectTasks'

import TasksBaseProvider from './TaskBaseProvider'

export default memo(function TasksProvider({ children }) {
  const {
    id: projectId,
    data: projectData,
    hasAccess,
    isArchived
  } = useProject()

  const { isLoading, error, retry } = useProjectTasks(
    projectData?.createdBy, 
    projectId, 
    hasAccess
  )

  const ownerId = projectData?.createdBy
  const taskRefs = useRef({}) // { [taskId]: DOMElement }

  const scrollIntoTask = (taskId) => {
    const element = taskRefs.current[taskId]

    if (element) element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  return (
    <TasksBaseProvider
      loading={isLoading}
      taskRefs={taskRefs}
      error={error}
      retry={retry}>
      {children}
    </TasksBaseProvider>
  )
})
