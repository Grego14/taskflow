import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import useUser from '@hooks/useUser'
import useDebounce from '@hooks/useDebounce'

import { Outlet } from 'react-router-dom'
import RouteHandler from './RoutesHandler'

import { useAuth } from '@/firebase/AuthContext'
import useGetUserFromDb from '@hooks/useGetUserFromDb'

import { getDatabase, onValue, ref } from 'firebase/database'
import updater from '@services/updateUser'
import lazyImport from '@utils/lazyImport'
import i18n from '@/i18n'
import getLocale from '@utils/getLocale'

export default function UserLogged() {
  const { uid, setFilter, setUpdaters } = useUser()
  const { setIsOffline, currentUser } = useAuth()

  const {
    metadata,
    preferences,
    updateFilter,
    userLoaded,
    setUserLoaded,
    setUser
  } = useUser()

  const userTheme = preferences?.theme

  const updateUser = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: async data => {
      await updater(uid, data)
    },
    onError: err => console.error('UpdateUser:', err)
  })

  const [debounceUpdater] = useDebounce(async data => {
    const { previewer, filter, type } = data

    await updateUser.mutate(
      previewer
        ? { previewer: previewer }
        : filter
          ? { lastUsedFilter: filter }
          : null
    )

    if (type === 'filter') {
      setFilter(filter)
    }
  }, 1500)

  // biome-ignore lint: This functions never changes
  useEffect(() => {
    setUpdaters({
      update: data => updateUser.mutate(data),
      updatePreviewer: previewer =>
        debounceUpdater({ previewer, type: 'previewer' }),
      updateFilter: filter => debounceUpdater({ filter, type: 'filter' })
    })
  }, [])

  // Manage the offline/online state
  useEffect(() => {
    const rtdb = getDatabase()
    const connectedRef = ref(rtdb, '.info/connected')

    const unsubscribe = onValue(connectedRef, snap => {
      // if snap.val() is true mean the user is online...
      setIsOffline(!snap.val())
    })

    return unsubscribe
  }, [setIsOffline])

  const { user, error } = useGetUserFromDb(uid, setUserLoaded)

  // sometimes the template project and user doc is not created so we check
  // if the user doc exists and if no, we create it
  useEffect(() => {
    ;(async () => {
      const docDoesNotExists = error?.includes?.('empty')

      if (docDoesNotExists) {
        const prefs = { theme: userTheme, lang: i18n.language }
        const createUserDoc = await lazyImport('/src/services/createUserDoc')
        await createUserDoc(currentUser, prefs)
      }

      if (userLoaded) {
        updateFilter(user?.metadata?.lastUsedFilter)
        setUser({
          ...user,
          preferences: {
            ...user.preferences,
            locale: getLocale(user.preferences.lang)
          }
        })
      }
    })()
  }, [currentUser, userTheme, error, userLoaded, setUser, updateFilter, user])

  return (
    <RouteHandler>
      <Outlet />
    </RouteHandler>
  )
}
