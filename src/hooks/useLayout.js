import LayoutContext from '@context/LayoutContext/context'
import { useContext } from 'react'

export default function useLayout() {
  return useContext(LayoutContext)
}
