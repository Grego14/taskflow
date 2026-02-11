import { useEffect, useMemo, useState } from 'react'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import AuthContext from './context'

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const { auth } = await import('@/firebase/firebase-config.js')
        const { onAuthStateChanged } = await import('firebase/auth')

        const unsubscribe = onAuthStateChanged(auth, user => {
          setCurrentUser(user)
        })

        return unsubscribe
      } catch (err) {
        console.error('Error loading auth:', err)
      }
    })()
  }, [])

  const value = useMemo(
    () => ({
      currentUser
    }),
    [currentUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
