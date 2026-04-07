import useAuth from '@hooks/useAuth'
import { dbAdapter } from '@services/dbAdapter'
import useUser from '@hooks/useUser'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { setGlobalAlert } from '@stores/ui'

export default function useGetUserFromDb() {
  const { t } = useTranslation('ui')
  const { isOffline } = useAuth()
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
          setGlobalAlert({
            message: t('notifications.cannotGetUserNoInternet'),
            status: 'error'
          })
        }
        setUserLoaded(true)
      }
    )

    return () => unsubscribe()
  }, [uid, setUser, setUserLoaded, isOffline, t, userLoaded])
}
