import { createContext } from 'preact/compat'

const RouteContext = createContext({
  lastRute: '/',
  navigateTo: () => { }
})

export default RouteContext
