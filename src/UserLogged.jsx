import { Outlet } from 'react-router-dom'

import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import useDebounce from '@hooks/useDebounce'
import useGetUserFromDb from '@hooks/useGetUserFromDb'
import useUser from '@hooks/useUser'
import { useMutation } from '@tanstack/react-query'
import { lazy, useEffect, useMemo, useRef, Suspense } from 'react'
import useLoadResources from '@hooks/useLoadResources'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
const CloudOffIcon = lazy(() => import('@mui/icons-material/CloudOff'))
const CloudSyncIcon = lazy(() => import('@mui/icons-material/CloudSync'))

import i18n from '@/i18n'
import updater from '@services/updateUser'
import getLocale from '@utils/getLocale'
import lazyImport from '@utils/lazyImport'

export default function UserLogged() {
  const { uid, setUpdateImplementation } = useUser()
  const { currentUser, initAuth } = useAuth()
  const { appNotification, notification, setIsOffline, isOffline } = useApp()

  const lastConnectionState = useRef(isOffline)
  const loadingResources = useLoadResources('ui')

  useEffect(() => {
    initAuth()
  }, [initAuth])

  const updateUser = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: data => updater(uid, data),
    onError: err => console.error('UpdateUser:', err)
  })

  useEffect(() => {
    setUpdateImplementation(data => updateUser.mutate(data))
  }, [updateUser.mutate, setUpdateImplementation])

  const [debounceOffline] = useDebounce(val => setIsOffline(val), 1250)

  // Manage the offline/online state
  useEffect(() => {
    if (!currentUser) return

    const initRTDB = async () => {
      const { getDatabase, ref, onValue } = await import('firebase/database')
      const rtdb = getDatabase()
      const connectedRef = ref(rtdb, '.info/connected')

      return onValue(connectedRef, snap => {
        debounceOffline(!snap.val())
      })
    }

    const unsubPromise = initRTDB()
    return () => unsubPromise.then(unsub => unsub?.())
  }, [currentUser, debounceOffline])

  const [sendInternetNotification] = useDebounce(async () => {
    const Icon = isOffline ? CloudOffIcon : CloudSyncIcon

    const internetNotification = await lazyImport(
      '/src/utils/notifications/internetConnection'
    )

    internetNotification(isOffline, props =>
      appNotification({
        ...props,
        icon: <Suspense fallback={null}>
          <Icon fontSize='small' />
        </Suspense>
      })
    )
  }, 3000)

  useEffect(() => {
    if (lastConnectionState.current !== isOffline) {
      sendInternetNotification()
      lastConnectionState.current = isOffline
    }
  }, [sendInternetNotification, isOffline])

  useGetUserFromDb()

  return <Outlet />
}
