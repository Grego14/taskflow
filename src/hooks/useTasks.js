import TasksContext from '@context/TasksContext/context'
import { useContext } from 'react'

export default function useTasks() {
  return useContext(TasksContext)
}
