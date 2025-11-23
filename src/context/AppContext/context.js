import { createContext } from 'react'

const AppContext = createContext({
  notification: null,
  isMobile: true,
  appBarHeight: '3.8rem',
  lastRute: '/',
  appNotification: () => {},
  setLastRute: () => {}
})

export default AppContext
