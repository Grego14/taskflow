import { Outlet } from 'react-router-dom'
import { lazy, useEffect, useRef, Suspense, useCallback } from 'react'

import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import useDebounce from '@hooks/useDebounce'
import useGetUserFromDb from '@hooks/useGetUserFromDb'
import useUser from '@hooks/useUser'
import { useLocation, useNavigate } from 'react-router-dom'

import useLoadResources from './hooks/useLoadResources'

import { setGlobalAlert } from '@stores/ui'

const CloudOff = lazy(() => import('@mui/icons-material/CloudOff'))
const CloudSync = lazy(() => import('@mui/icons-material/CloudSync'))

export default function UserLogged() {
  const { uid, updatePlaceholder } = useUser()
  const { currentUser, refreshUser, initAuth } = useAuth()
  const { setIsOffline, isOffline } = useApp()
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

  useEffect(() => {
    updatePlaceholder.current = async (data) => {
      try {
        if(!uid) return

        const { default: userService } = await import('@services/user')
        return await userService.update(uid, data)
      } catch (err) {
        console.error('UserLogged updatePlaceholder ->', err)
        return { error: true, message: err.message }
      }
    }
  }, [uid])

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
    const { default: internetNotification } = 
      await import('@utils/notifications/internetAlert')

    internetNotification(isOffline, props => setGlobalAlert({
      ...props,
      icon: <Suspense fallback={null}>
        <Icon fontSize='small' />
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

  return <Outlet />
}
