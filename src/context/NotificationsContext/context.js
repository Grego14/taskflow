import { createContext } from 'react'

const NotificationsContext = createContext({
  notifications: null,
  error: null,
  loading: true,
  deleteNotification: () => { },
  // special functions used when the notification is a invitation to a project
  onDecline: () => { },
  onAccept: () => { }
})

export default NotificationsContext
