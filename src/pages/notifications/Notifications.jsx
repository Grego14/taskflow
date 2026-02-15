import NotificationsProvider from '@context/NotificationsContext'
import Typography from '@mui/material/Typography'

import useNotifications from '@hooks/useNotifications'

export default function Notifications() {
  return (
    <NotificationsProvider>
      <Layout />
    </NotificationsProvider>
  )
}

const Layout = () => {
  const { notifications } = useNotifications()

  console.log(notifications)

  return (
    <Typography>Holi!</Typography>
  )
}
