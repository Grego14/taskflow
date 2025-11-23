import { createContext } from 'react'

const TaskActionsContext = createContext({
  updatePriority: null,
  updateStatus: null,
  updateTitle: null
})

export default TaskActionsContext
