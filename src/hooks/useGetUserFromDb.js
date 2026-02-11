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

    const initFirestore = async () => {
      try {
        const [db, fs] = await Promise.all([
          import('@/db.js'),
          import('firebase/firestore')
        ])

        const { doc, onSnapshot } = fs
        const userDoc = doc(db.default, 'users', uid)

        unsubscribe = onSnapshot(
          userDoc,
          userSnapshot => {
            if (userSnapshot.exists()) {
              setUser(userSnapshot.data())
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
      } catch (err) {
        console.error('Failed to load Firestore modules', err)
        setUserLoaded(true)
      }
    }

    initFirestore()

    return () => unsubscribe?.()
  }, [uid, setUser, setUserLoaded, appNotification, isOffline, t])
}
