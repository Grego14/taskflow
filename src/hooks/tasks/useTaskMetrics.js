import { useEffect } from 'preact/hooks'
import useProject from '@hooks/useProject'
import { taskRegistry, taskVersion } from '@stores/task'

const isNotCancelled = status => status !== 'cancelled'

export default function useTaskMetrics() {
  const { updateMetrics, metrics } = useProject()

  // subscribe to task deletion/creation
  const registry = taskRegistry.value
  // subscribe to some task changes (ex: status changes)
  const version = taskVersion.value

  useEffect(() => {
    if (!registry.size) return

    let totalTasks = 0
    let totalCompletedTasks = 0

    for (const taskSignal of registry.values()) {
      const task = taskSignal.peek()
      const isSubtask = !!task.parentId
      const parentNotCancelled = isNotCancelled(task.status)
      
      if (isSubtask) {
        const parent = registry.get(task.parentId)

        // only count subtasks if their parent is not cancelled
        if (
          parent && 
          isNotCancelled(parent.status) && 
          parentNotCancelled
        ) {
          totalTasks++
          if (task.status === 'done') totalCompletedTasks++
        }
      } else {
        // parent tasks only need to be not cancelled
        if (parentNotCancelled) {
          totalTasks++
          if (task.status === 'done') totalCompletedTasks++
        }
      }
    }

    updateMetrics(prev => {
      const hasChanged = prev?.totalTasks !== totalTasks ||
        prev?.totalCompletedTasks !== totalCompletedTasks

      return hasChanged ? { ...prev, totalTasks, totalCompletedTasks } : prev
    })
  }, [registry, updateMetrics, version])
}
