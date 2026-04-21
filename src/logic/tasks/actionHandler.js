import { setGlobalAlert } from '@stores/ui'
import { taskRegistry } from '@stores/task'

export default async function actionHandler(actionFn) {
  const rollbackMap = taskRegistry.value

  try {
    return await actionFn()
  } catch (error) {
    // automatic rollback
    taskRegistry.value = rollbackMap
    
    setGlobalAlert({ status: 'error', message: 'Action error: ...' })
    
    console.error('Action failed:', error)
    throw error
  }
}
