import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function useGetUserFromDb(userId, setLoadedState) {
  const { t } = useTranslation('ui')
  const { isOffline } = useAuth()
  const { appNotification } = useApp()
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // no logged
    if (!userId) {
      setUser(null)
      setLoadedState(true)
    } else {
      let unsubscribe

      import('@/db.js').then(mod => {
        const db = mod.default

        import('firebase/firestore').then(mod => {
          const { doc, onSnapshot } = mod
          const userDoc = doc(db, 'users', userId)

          unsubscribe = onSnapshot(
            userDoc,
            userSnapshot => {
              if (userSnapshot.exists()) {
                setUser(userSnapshot.data())
                setLoadedState(true)
                return
              }

              setError('empty')
              setLoadedState(true)
            },
            err => {
              console.error(err)
              setError(err)

              if (isOffline) {
                appNotification({
                  message: t('notifications.cannotGetUserNoInternet'),
                  status: 'error'
                })
              }

              setLoadedState(true)
            }
          )
        })
      })

      return () => unsubscribe?.()
    }
  }, [userId, setLoadedState, appNotification, isOffline, t])

  return { user, error }
}
