import {
  useState, 
  useEffect, 
  useMemo, 
  useRef
} from 'preact/compat'
import { signal } from '@preact/signals'
import useUser from '@hooks/useUser'

import TasksBaseProvider from '@context/TasksContext/TaskBaseProvider'
import ProjectContext from '@pages/projects/context'

import { getItem, setItem } from '@utils/storage'
import getFirstPosition from '@utils/tasks/getFirstPosition'
import { USER_FIELDS_MAP } from '@/constants'
import getLocale from '@utils/getLocale'

import { taskRegistry } from '@stores/task'

export default function MockProvider({ children }) {
  const { 
    uid, 
    updatePlaceholder, 
    setUser, 
    preferences, 
    profile, 
    metadata
  } = useUser()
  const [data, setData] = useState(() => getItem('preview'))
  const project = data?.projects?.[0]

  const taskRefs = useRef({})

  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    totalCompletedTasks: 0
  })

  updatePlaceholder.current = async (dataToUpdate) => {
    try {
      const updatedUser = {
        profile: { ...profile, ...data.user?.profile },
        preferences: { ...preferences, ...data.user?.preferences },
        metadata: { ...metadata, ...data.user?.metadata },
        uid
      }

      let hasChanged = false
      for (const [key, value] of Object.entries(dataToUpdate)) {
        const dbPath = USER_FIELDS_MAP[key]
        if (!dbPath) continue

        // ex: ['profile', 'username']
        const [section, field] = dbPath.split('.')

        // update the property on it's section
        if (updatedUser[section]) {
          updatedUser[section] = { 
            ...updatedUser[section], 
            [field]: value 
          }

          hasChanged = true
        }

        // automatic logic to the locale if the lang changes
        if (key === 'lang') updatedUser.preferences.locale = getLocale(value)
      }

      if (!hasChanged) return { error: false }

      const newFullState = { ...data, user: updatedUser }
      setItem('preview', newFullState)
      setData(newFullState)
      setUser(updatedUser)

      return { error: false }
    } catch (e) {
      console.error('Demo Update Error:', e)
      return { error: true }
    }
  }

  useEffect(() => {
    const data = getItem('preview')
    const tasks = data.tasks || []
    const newMap = new Map()

    for (const task of tasks) {
      newMap.set(task.id, signal({ 
        ...task, 
        subtasks: task.subtasks || [] 
      }))
    }

    // link children to parents
    for (const task of tasks) {
      const pId = task.parentId

      if (pId && newMap.has(pId)) {
        const parentSignal = newMap.get(pId)
        const parentData = parentSignal.peek()

        // avoid duplicates
        if (!parentData.subtasks.includes(task.id)) {
          parentSignal.value = {
            ...parentData,
            subtasks: [...parentData.subtasks, task.id]
          }
        }
      }
    }

    taskRegistry.value = newMap
  }, [])

  const projectValue = useMemo(() => ({
    id: project?.id,
    data: project,
    isArchived: false,
    isOwner: true,
    hasAccess: true,
    validating: false,
    loading: false,
    error: null,
    projectMembers: project?.members,
    metrics,
    updateMetrics: setMetrics
  }), [project, metrics])

  return (
    <ProjectContext.Provider value={projectValue}>
      <TasksBaseProvider taskRefs={taskRefs}>
        {children}
      </TasksBaseProvider>
    </ProjectContext.Provider>
  )
}
