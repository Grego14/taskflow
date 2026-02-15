import { useEffect, useMemo, useState } from 'react'

import AuthContext from './context'

const mapUserData = user => {
  if (!user) return null

  return {
    uid: user.uid,
    email: user.email,
    username: user.displayName,
    avatar: user.photoURL,
    metadata: {
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime
    },
    providerId: user.providerData[0].providerId
  }
}

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
          setCurrentUser(mapUserData(user))
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
  }), [currentUser, initialized])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
