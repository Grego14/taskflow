import NotificationsContext from '@context/NotificationsContext/context'
import { useContext } from 'react'

export default function useNotifications() {
  return useContext(NotificationsContext)
}
