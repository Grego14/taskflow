import { Outlet } from 'react-router-dom'
import { lazy, useEffect, useRef, Suspense, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'

import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import useDebounce from '@hooks/useDebounce'
import useGetUserFromDb from '@hooks/useGetUserFromDb'
import useUser from '@hooks/useUser'
import { useLocation, useNavigate } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useLoadResources from './hooks/useLoadResources'

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
  const { uid, setUpdatePlaceholder } = useUser()
  const { currentUser, refreshUser, initAuth } = useAuth()
  const { appNotification, setIsOffline, isOffline } = useApp()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const lastConnectionState = useRef(isOffline)

  // load the resources before the user is able to see anything
  const loadingResources = useLoadResources('ui')

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    if (!currentUser) return

    // force user reload to get the emailVerified state
    const checkVerification = async () => {
      if (!currentUser.emailVerified) {
        await refreshUser()
      }

      // if after refresh the user is still not verified we send him to the
      // /verify rute
      if (!currentUser.emailVerified && pathname !== '/verify')
        navigate('/verify', { replace: true })
    }

    checkVerification()
  }, [currentUser?.uid, navigate])

  const updateUserMutation = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: async (data) => {
      if (!uid) return
      const { default: userService } = await import('@services/user')
      return await userService(uid, data)
    },
    onError: err => console.error('UpdateUser:', err)
  })

  useEffect(() => {
    setUpdatePlaceholder?.(() => async (data) => {
      try {
        const result = await updateUserMutation.mutateAsync(data)
        return result
      } catch (err) {
        return { error: true, message: err.message }
      }
    })
  }, [setUpdatePlaceholder, updateUserMutation.mutateAsync])

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
    const { default: internetNotification } = await import('@utils/notifications/internetAlert')

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
