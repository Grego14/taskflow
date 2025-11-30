import useDebounce from '@hooks/useDebounce.js'
import { useEffect, useMemo, useState } from 'react'

import { auth } from '@/firebase/firebase-config.js'
import { onAuthStateChanged } from 'firebase/auth'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import AuthContext from './context'

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(auth.currentUser)
  const [loading, setLoading] = useState(true)

  // set the offline state as true to avoid showing the offline notification
  // on the initial update
  const [isOffline, setIsOffline] = useState(false)
  const [debounceOffline] = useDebounce(val => setIsOffline(val), 1000)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      isOffline,
      setIsOffline: debounceOffline
    }),
    [loading, currentUser, isOffline, debounceOffline]
  )

  if (loading) return <CircleLoader height='100dvh' />

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
