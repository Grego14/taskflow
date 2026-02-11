import { createContext } from 'react'

const AuthContext = createContext({
  currentUser: null,
  initAuth: () => { }
})

export default AuthContext
