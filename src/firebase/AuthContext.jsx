import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { onAuthStateChange } from './auth.js'
import { getDatabase, ref, onValue } from 'firebase/database'
import { auth, db } from './firebase-config.js'

const AuthContext = createContext({
  currentUser: null,
  loading: true,
  isOffline: false
})

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(auth.currentUser)
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)

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

    onValue(connectedRef, snap => {
      // if this is true mean the user is offline...
      setIsOffline(!snap.val())
      console.log('Connection state -> ', snap.val() ? 'online' : 'offline')
    })
  })

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
