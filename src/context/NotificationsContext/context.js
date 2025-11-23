import { createContext } from 'react'

const NotificationsContext = createContext({
  notifications: [],
  deleteNotification: () => {},

  // special functions used when the notification is a invitation to a project
  onDecline: () => {},
  onAccept: () => {}
})

export default NotificationsContext
