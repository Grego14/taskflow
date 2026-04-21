import { setGlobalAlert } from '@stores/ui'
import { taskRegistry } from '@stores/task'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import i18n from '@/i18n'

export default async function actionHandler(actionFn, snapshot) {
  try {
    return await actionFn()
  } catch (error) {
    // automatic rollback
    taskRegistry.value = snapshot
    
    setGlobalAlert({ 
      status: 'error', 
      message: getFriendlyAuthError(error.message, i18n.language) 
    })
    
    console.error('Action failed:', error)
    throw error
  }
}
