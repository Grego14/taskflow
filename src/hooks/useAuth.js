import { useContext } from 'react'
import AuthContext from '@context/AuthContext/context'

export default function useAuth() {
  return useContext(AuthContext)
}
