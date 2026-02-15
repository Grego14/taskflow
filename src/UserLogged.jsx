import { Outlet } from 'react-router-dom'
import { lazy, useEffect, useRef, Suspense, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'

import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import useDebounce from '@hooks/useDebounce'
import useGetUserFromDb from '@hooks/useGetUserFromDb'
import useUser from '@hooks/useUser'
import useLoadResources from '@hooks/useLoadResources'

import updater from '@services/updateUser'
import lazyImport from '@utils/lazyImport'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const CloudOff = lazy(() => import('@mui/icons-material/CloudOff'))
const CloudSync = lazy(() => import('@mui/icons-material/CloudSync'))

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
    import('@tanstack/react-query-devtools').then(module => ({
      default: module.ReactQueryDevtools
    }))
  )
  : null

const queryClient = new QueryClient()

const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV &&
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      }
      {children}
    </QueryClientProvider>
  )
}

const Services = () => {
  const { uid, setUpdateImplementation } = useUser()
  const { currentUser, initAuth } = useAuth()
  const { appNotification, setIsOffline, isOffline } = useApp()

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

  // We wrap the mutation call to keep the reference stable
  const handleUpdate = useCallback(data => {
    updateUser.mutate(data)
  }, [updateUser])

  useEffect(() => {
    setUpdateImplementation(handleUpdate)
  }, [handleUpdate, setUpdateImplementation])

  const [debounceOffline] = useDebounce(val => setIsOffline(val), 1250)

  // Firebase RTDB connection listener
  useEffect(() => {
    if (!currentUser) return

    let unsub

    const initRTDB = async () => {
      const { getDatabase, ref, onValue } = await import('firebase/database')
      const rtdb = getDatabase()
      const connectedRef = ref(rtdb, '.info/connected')

      unsub = onValue(connectedRef, snap => {
        debounceOffline(!snap.val())
      })
    }

    initRTDB()
    return () => unsub?.()
  }, [currentUser, debounceOffline])

  const [sendInternetNotification] = useDebounce(async () => {
    const Icon = isOffline ? CloudOff : CloudSync
    const internetNotification = await lazyImport('/src/utils/notifications/internetConnection')

    internetNotification(isOffline, props => appNotification({
      ...props,
      icon: <Suspense fallback={null}>
        <Icon fontSize='smal' />
      </Suspense>
    }))
  }, 3000)

  useEffect(() => {
    if (lastConnectionState.current !== isOffline) {
      sendInternetNotification()
      lastConnectionState.current = isOffline
    }
  }, [sendInternetNotification, isOffline])

  useGetUserFromDb()
}

export default function UserLogged() {
  return <QueryProvider>
    <Services />
    <Outlet />
  </QueryProvider>
}
