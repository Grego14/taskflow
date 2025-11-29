import { createContext } from 'react'

const AuthContext = createContext({
  currentUser: null,
  loading: true,
  isOffline: false
})

export default AuthContext
