import { useEffect, useMemo, useState } from 'react'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import AuthContext from './context'

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [shouldInit, setShouldInit] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!shouldInit) return

    const init = async () => {
      try {
        const { auth } = await import('@/firebase/firebase-config.js')
        const { onAuthStateChanged } = await import('firebase/auth')

        return onAuthStateChanged(auth, user => {
          setCurrentUser(user)
          initialized(true)
        })
      } catch (err) {
        console.error('Error loading auth:', err)
      }
    }

    const unsubPromise = init()
    return () => unsubPromise.then(unsub => unsub?.())
  }, [shouldInit])

  const value = useMemo(() => ({
    currentUser,
    initAuth: () => setShouldInit(true),
    initialized
  }), [currentUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
