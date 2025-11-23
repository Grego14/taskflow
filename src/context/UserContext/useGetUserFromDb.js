import { db } from '@/firebase/firebase-config'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export default function useGetUserFromDb(userId) {
  const [user, setUser] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // no logged
    if (!userId) {
      setUserLoaded(true)
    } else {
      const userDoc = doc(db, 'users', userId)

      const unsubscribe = onSnapshot(
        userDoc,
        userSnapshot => {
          if (userSnapshot.exists()) {
            setUser(userSnapshot.data())
            setUserLoaded(true)

            return
          }

          setError('empty')
        },
        err => {
          console.error(err)
          setError(err)
        }
      )

      return () => unsubscribe()
    }
  }, [userId])

  return { user, userLoaded, error }
}
