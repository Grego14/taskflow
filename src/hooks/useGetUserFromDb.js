import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import { dbAdapter } from '@services/dbAdapter'
import useUser from '@hooks/useUser'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function useGetUserFromDb() {
  const { t } = useTranslation('ui')
  const { isOffline } = useAuth()
  const { appNotification } = useApp()
  const { uid, setUser, setUserLoaded, userLoaded } = useUser()

  useEffect(() => {
    if (!uid) return

    const userRef = dbAdapter.getDocRef('users', uid)

    const unsubscribe = dbAdapter.listen(
      userRef,
      snapshot => {
        if (snapshot.exists()) {
          setUser(snapshot.data())
        }

        if (!userLoaded) setUserLoaded(true)
      },
      (err) => {
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

    return () => unsubscribe()
  }, [uid, setUser, setUserLoaded, appNotification, isOffline, t, userLoaded])
}
