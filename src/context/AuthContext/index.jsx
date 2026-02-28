import { useEffect, useMemo, useState, useCallback } from 'react'

import AuthContext from './context'

const mapUserData = user => {
  if (!user) return null
  const providerData = user.providerData?.[0]

  return {
    uid: user.uid,
    email: user.email || providerData?.email,
    emailVerified: user.emailVerified,
    username: user.displayName,
    avatar: user.photoURL,
    metadata: {
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime
    },
    providerId: providerData?.providerId
  }
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [shouldInit, setShouldInit] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const refreshUser = useCallback(async () => {
    try {
      const { auth } = await import('@/firebase/firebase-config.js')
      const { reload } = await import('firebase/auth')
      const user = auth.currentUser

      if (user) {
        await reload(user)
        setCurrentUser(mapUserData(auth.currentUser))
      }
    } catch (err) {
      console.error('Error refreshing user:', err)
    }
  }, [])

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
    refreshUser,
    initialized
  }), [currentUser, initialized])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
