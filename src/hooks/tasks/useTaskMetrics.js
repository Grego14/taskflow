import { useEffect } from 'preact/hooks'
import useProject from '@hooks/useProject'
import { taskRegistry } from '@stores/task'

const isNotCancelled = status => status !== 'cancelled'

export default function useTaskMetrics() {
  const { updateMetrics, metrics } = useProject()
  const registry = taskRegistry.value

  useEffect(() => {
    if (!registry.size) return

    let totalTasks = 0
    let totalCompletedTasks = 0

    for (const task of registry.values()) {
      const isSubtask = !!task.parentId
      
      if (isSubtask) {
        const parent = registry.get(task.parentId)

        // only count subtasks if their parent is not cancelled
        if (
          parent && 
          isNotCancelled(parent.status) && 
          isNotCancelled(task.status)
        ) {
          totalTasks++
          if (task.status === 'done') totalCompletedTasks++
        }
      } else {
        // parent tasks only need to be not cancelled
        if (isNotCancelled(task.status)) {
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
  }, [registry, updateMetrics])
}
