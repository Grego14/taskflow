import { useEffect, useMemo, useState } from 'react'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import AuthContext from './context'

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [shouldInit, setShouldInit] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!shouldInit) return

    let unsubscribe;

    (async () => {
      try {
        const { auth } = await import('@/firebase/firebase-config.js')
        const { onAuthStateChanged } = await import('firebase/auth')

        unsubscribe = onAuthStateChanged(auth, user => {
          setCurrentUser(user)
          setInitialized(true)
        })
      } catch (err) {
        console.error('Error loading auth:', err)
      }
    })()

    return () => unsubscribe?.()
  }, [shouldInit])

  const value = useMemo(() => ({
    currentUser,
    initAuth: () => setShouldInit(true),
    initialized
  }), [currentUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
