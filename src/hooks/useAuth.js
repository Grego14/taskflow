import AuthContext from '@context/AuthContext/context'
import { useContext } from 'react'

export default function useAuth() {
  return useContext(AuthContext)
}
