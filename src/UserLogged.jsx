import { Outlet } from 'react-router-dom'

import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import useDebounce from '@hooks/useDebounce'
import useGetUserFromDb from '@hooks/useGetUserFromDb'
import useUser from '@hooks/useUser'
import { useMutation } from '@tanstack/react-query'
import { Suspense, lazy, useEffect, useMemo, useRef } from 'react'

const CloudOffIcon = lazy(() => import('@mui/icons-material/CloudOff'))
const CloudSyncIcon = lazy(() => import('@mui/icons-material/CloudSync'))

import i18n from '@/i18n'
import updater from '@services/updateUser'
import getLocale from '@utils/getLocale'
import lazyImport from '@utils/lazyImport'
import { getDatabase, onValue, ref } from 'firebase/database'

export default function UserLogged() {
  const { uid, setUpdate } = useUser()
  const { currentUser } = useAuth()
  const { appNotification, notification, setIsOffline, isOffline } = useApp()

  const lastConnectionState = useRef(isOffline)

  const { metadata, preferences, userLoaded, setUserLoaded, setUser } =
    useUser()
  const userTheme = preferences?.theme

  const [debounceOffline] = useDebounce(val => setIsOffline(val), 1250)

  const [sendInternetNotification] = useDebounce(async () => {
    const icon = isOffline ? (
      <CloudOffIcon fontSize='small' />
    ) : (
      <CloudSyncIcon fontSize='small' />
    )

    const internetNotification = await lazyImport(
      '/src/utils/notifications/internetConnection'
    )

    internetNotification(isOffline, props =>
      appNotification({ ...props, icon })
    )
  }, 3000)

  const updateUser = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: async data => await updater(uid, data),
    onError: err => console.error('UpdateUser:', err)
  })

  useEffect(() => {
    setUpdate(() => data => updateUser.mutate(data))
  }, [setUpdate, updateUser.mutate])

  // Manage the offline/online state
  useEffect(() => {
    const rtdb = getDatabase()
    const connectedRef = ref(rtdb, '.info/connected')

    const unsubscribe = onValue(connectedRef, snap => {
      // if snap.val() is true mean the user is online...
      debounceOffline(!snap.val())
    })

    return unsubscribe
  }, [debounceOffline])

  useEffect(() => {
    if (lastConnectionState.current !== isOffline) {
      sendInternetNotification()
      lastConnectionState.current = isOffline
    }
  }, [sendInternetNotification, isOffline])

  const { user, error } = useGetUserFromDb(uid, setUserLoaded)

  useEffect(() => {
    ;(async () => {
      if (userLoaded) {
        setUser({
          ...user,
          preferences: {
            ...user?.preferences,
            locale: getLocale(user?.preferences.lang)
          }
        })
      }
    })()
  }, [userLoaded, setUser, user])

  return <Outlet />
}
