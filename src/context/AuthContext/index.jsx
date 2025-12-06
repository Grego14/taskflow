import { useEffect, useMemo, useState } from 'react'

import { auth } from '@/firebase/firebase-config.js'
import { onAuthStateChanged } from 'firebase/auth'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import AuthContext from './context'

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(auth.currentUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      currentUser
    }),
    [currentUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
