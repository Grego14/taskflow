import { useEffect } from 'preact/hooks'
import useProject from '@hooks/useProject'
import useTasks from '../useTasks'

const isNotCancelled = status => status !== 'cancelled'

export default function useProjectMetrics() {
  const { updateMetrics, metrics } = useProject()
  const { tasks } = useTasks()

  useEffect(() => {
    if (!tasks) return

    const pendingSubtasks = tasks.flatMap(t => t.subtasks || [])
      .filter(s => isNotCancelled(s.status))
    const pendingTasks = tasks.filter(t => isNotCancelled(t.status))

    const totalTasks = pendingSubtasks.length + pendingTasks.length
    const totalCompletedTasks =
      pendingTasks.filter(t => t.status === 'done').length +
      pendingSubtasks.filter(s => s.status === 'done').length

    updateMetrics(prev => {
      if (
        prev?.totalTasks !== totalTasks ||
        prev?.totalCompletedTasks !== totalCompletedTasks
      ) {
        return { ...prev, totalTasks, totalCompletedTasks }
      }
      return prev
    })
  }, [tasks, updateMetrics])
}
