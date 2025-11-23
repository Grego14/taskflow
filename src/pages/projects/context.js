import { createContext, useContext } from 'react'

const ProjectContext = createContext({
  id: undefined,
  data: null,
  hasAccess: false,
  validating: true,
  projectMembers: null
})

export default ProjectContext
