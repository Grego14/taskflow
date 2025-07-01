import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { onAuthStateChange } from './auth.js'
import { doc, getDocFromServer, getDocFromCache } from 'firebase/firestore'
import { getDatabase, ref, onValue } from 'firebase/database'
import { auth } from './firebase-config.js'

const usersDoc = id => doc(db, 'users', id)

const AuthContext = createContext({
  currentUser: null,
  loading: true,
  userDoc: null,
  isOffline: false
})

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(auth.currentUser)
  const [loading, setLoading] = useState(true)
  const [gettingUser, setGettingUser] = useState(false)
  const [superUser, setSuperUser] = useState(null)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Get the user from cache or server (if uid exists)
  useEffect(() => {
    const uid = currentUser?.uid

    async function getUser() {
      try {
        if (!uid) return

        console.log('Star to get the user...')
        setGettingUser(true)

        const cacheSnap = await getDocFromCache(usersDoc(uid))

        if (cacheSnap.exists()) {
          setSuperUser(cacheSnap.data())
        }
      } catch (err) {
        const noDataOnCache = err.message.match(
          'Failed to get document from cache'
        )?.[0]

        if (noDataOnCache) {
          getUserFromServer()
        }

        console.error(err.message)
      }
    }

    async function getUserFromServer() {
      try {
        const serverSnap = await getDocFromServer(usersDoc(uid))

        if (serverSnap.exists()) setSuperUser(serverSnap.data())
      } catch (err) {
        console.error(err)
      } finally {
        setGettingUser(false)
      }
    }

    getUser()
  }, [currentUser?.uid])

  // Manage the offline state
  // TODO - Debounce this
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
      superUser,
      gettingUser,
      isOffline
    }),
    [loading, currentUser, superUser, gettingUser, isOffline]
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
