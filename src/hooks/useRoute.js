import RouteContext from '@context/RouteContext/context'
import { useContext } from 'preact/hooks'

export default function useRoute() {
  return useContext(RouteContext)
}
