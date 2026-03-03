import { createContext } from 'react'

const TasksContext = createContext({
  tasks: null,
  actions: {},
  error: false,
  loading: true,
  scrollIntoTask: () => { }
})

export default TasksContext
