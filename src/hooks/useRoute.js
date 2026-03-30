import { useContext } from 'preact/hooks'
import RouteContext from '@context/RouteContext/context'

export default function useRoute() { return useContext(RouteContext) }
