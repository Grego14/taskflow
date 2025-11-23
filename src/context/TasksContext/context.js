import {
  priorities,
  priorityColors,
  statuses,
  statusesColors
} from '@/constants'
import { createContext } from 'react'

const TasksContext = createContext({
  priorities,
  statuses,
  priorityColors,
  statusesColors
})

export default TasksContext
