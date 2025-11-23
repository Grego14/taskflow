import AppContext from '@context/AppContext/context'
import { useContext } from 'react'

export default function useApp() {
  return useContext(AppContext)
}
