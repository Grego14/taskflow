import TaskActionsContext from '@context/TaskActionsContext/context'
import { useContext } from 'react'

export default function useTaskActions() {
  return useContext(TaskActionsContext)
}
