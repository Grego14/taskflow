import { taskRegistry } from '@stores/task'

export default function useTask(id) {
  // get the task without subscribe to the global registry
  const taskSignal = taskRegistry.peek().get(id)

  // return the value (this creates the task subscription)
  return taskSignal ? taskSignal.value : null
}
