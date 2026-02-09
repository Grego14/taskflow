import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import useUser from '@hooks/useUser'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function useGetUserFromDb() {
  const { t } = useTranslation('ui')
  const { isOffline } = useAuth()
  const { appNotification } = useApp()
  const { uid, setUser, setUserLoaded } = useUser()

  useEffect(() => {
    if (!uid) {
      setUserLoaded(true)
      return
    }

    let unsubscribe

    // dynamic imports for bundle optimization
    import('@/db.js').then(mod => {
      const db = mod.default

      import('firebase/firestore').then(mod => {
        const { doc, onSnapshot } = mod
        const userDoc = doc(db, 'users', uid)

        unsubscribe = onSnapshot(
          userDoc,
          userSnapshot => {
            if (userSnapshot.exists()) {
              setUser(userSnapshot.data())
            } else {
              console.warn('No user document found')
            }
            setUserLoaded(true)
          },
          err => {
            console.error('useGetUserFromDb:', err)

            if (isOffline) {
              appNotification({
                message: t('notifications.cannotGetUserNoInternet'),
                status: 'error'
              })
            }
            setUserLoaded(true)
          }
        )
      })
    })

    return () => unsubscribe?.()
  }, [uid, setUser, setUserLoaded, appNotification, isOffline, t])
}
