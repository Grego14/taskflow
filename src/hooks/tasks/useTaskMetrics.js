import { useEffect } from 'preact/hooks'
import useProject from '@hooks/useProject'
import useTasks from '../useTasks'

const isNotCancelled = status => status !== 'cancelled'

export default function useTaskMetrics() {
  const { updateMetrics, metrics } = useProject()
  const { tasks } = useTasks()

  useEffect(() => {
    if (!tasks) return

    let totalTasks = 0
    let totalCompletedTasks = 0

    for (const task of tasks) {
      const parentActive = isNotCancelled(task.status)

      if (parentActive) {
        totalTasks++
        if (task.status === 'done') totalCompletedTasks++

        if (task.subtasks?.length <= 0) continue

        for (const sub of task.subtasks) {
          // only count subtasks with pending/non-cancelled parents
          if (isNotCancelled(sub.status)) {
            totalTasks++
            if (sub.status === 'done') totalCompletedTasks++
          }
        }
      }
    }

    updateMetrics(prev => {
      const hasChanged = prev?.totalTasks !== totalTasks ||
        prev?.totalCompletedTasks !== totalCompletedTasks

      return hasChanged ? { ...prev, totalTasks, totalCompletedTasks } : prev
    })
  }, [tasks, updateMetrics])
}
