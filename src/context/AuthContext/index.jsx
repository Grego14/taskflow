import { useEffect, useMemo, useState } from 'react'

import { auth } from '@/firebase/firebase-config.js'
import { onAuthStateChanged } from 'firebase/auth'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import AuthContext from './context'

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(auth.currentUser)
  const [loading, setLoading] = useState(true)

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
      loading
    }),
    [loading, currentUser]
  )

  if (loading) return <CircleLoader height='100dvh' />

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
