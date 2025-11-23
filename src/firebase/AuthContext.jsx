import useDebounce from '@hooks/useDebounce.js'
import { getDatabase, onValue, ref } from 'firebase/database'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChange } from './auth.js'
import { auth, db } from './firebase-config.js'

const AuthContext = createContext({
  currentUser: null,
  loading: true,
  isOffline: false
})

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(auth.currentUser)
  const [loading, setLoading] = useState(true)
  // set the offline state as true to avoid showing the offline notification
  // on the initial update
  const [isOffline, setIsOffline] = useState(false)
  const [debounceOffline] = useDebounce(val => {
    setIsOffline(val)
    console.log('Connection state -> ', val ? 'offline' : 'online')
  }, 1000)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

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

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      isOffline
    }),
    [loading, currentUser, isOffline]
  )

  return (
    !loading && (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    )
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
