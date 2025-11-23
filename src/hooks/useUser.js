import UserContext from '@context/UserContext/context'
import { useContext } from 'react'

export default function useUser() {
  return useContext(UserContext)
}
