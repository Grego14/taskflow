import ProjectContext from '@pages/projects/context'
import { useContext } from 'react'

export default function useProject() {
  return useContext(ProjectContext)
}
