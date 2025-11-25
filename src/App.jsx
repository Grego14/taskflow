import { Suspense, lazy, useEffect, useRef } from 'react'

// components
import AppRoutes from './AppRoutes.jsx'
import Notification from '@components/ui/notification/Notification'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import CloudSyncIcon from '@mui/icons-material/CloudSync'

// hooks
import useApp from '@hooks/useApp'
import useDebounce from '@hooks/useDebounce'
import { useColorScheme } from '@mui/material/styles'
import { useAuth } from './firebase/AuthContext'

// utils
import internetNotification from '@utils/notifications/internetConnection.js'
import './App.css'

export default function App() {
  const { currentUser, isOffline } = useAuth()
  const { appNotification, notification } = useApp()
  const { mode } = useColorScheme()

  const [sendInternetNotification] = useDebounce(() => {
    const icon = isOffline ? (
      <CloudOffIcon fontSize='small' />
    ) : (
      <CloudSyncIcon fontSize='small' />
    )

    internetNotification(isOffline, props =>
      appNotification({ ...props, icon })
    )
  }, 3000)
  const lastConnectionState = useRef(isOffline)

  useEffect(() => {
    if (currentUser?.uid && lastConnectionState.current !== isOffline) {
      sendInternetNotification()
      lastConnectionState.current = isOffline
    }
  }, [currentUser, sendInternetNotification, isOffline])

  if (!mode) return null

  return (
    <>
      <AppRoutes />
      <Suspense>{notification && <Notification />}</Suspense>
    </>
  )
}
