import CircleLoader from '@components/reusable/loaders/CircleLoader'
import { Outlet } from 'react-router-dom'

// hooks
import { useAuth } from '@/firebase/AuthContext'
import useDebounce from '@hooks/useDebounce'
import { useColorScheme } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'

// utils
import { FILTERS, QUERY_STALE_TIME } from '@/constants'
import getLocale from '@utils/getLocale'
import lazyImport from '@utils/lazyImport'
import UserContext from './context.js'
import updater from './updater'

import { serverTimestamp } from 'firebase/firestore'
import useGetUserFromDb from './useGetUserFromDb'

const getPreview = preview => (preview === 'list' ? 'list' : 'kanban')
const getFilter = filter => FILTERS.find(f => f === filter) || 'default'

export default function UserProvider() {
  const { t, i18n } = useTranslation('ui')
  const { currentUser, isOffline } = useAuth()
  const userId = currentUser?.uid
  const { mode, systemMode } = useColorScheme()
  const userTheme = mode === 'system' ? systemMode : mode

  const [updateLastActive] = useDebounce(async () => {
    await updater(userId, { lastActive: serverTimestamp() })
  }, 60000)

  const { user, userLoaded, error } = useGetUserFromDb(userId)

  // use a local filter so the user see the filter update faster. Also allow
  // filtering tasks when the user has no connection
  const [filter, setFilter] = useState(
    user?.metadata?.lastUsedFilter || 'default'
  )

  const [debounceUpdater] = useDebounce(async data => {
    const { previewer, filter } = data

    await updater(
      userId,
      previewer ? { previewer } : filter ? { lastUsedFilter: filter } : null
    )
  }, 1500)

  useEffect(() => {
    ;(async () => {
      const docDoesNotExists = error?.includes?.('empty')

      // sometimes the template project and user doc is not created so we check
      // if the user doc exists and if no, we create it
      if (docDoesNotExists) {
        const prefs = { theme: userTheme, lang: i18n.language }
        const createUserDoc = await lazyImport('/src/services/createUserDoc')
        await createUserDoc(currentUser, prefs)
      }

      // initial update (avoid the 60s delay of the debounce function)
      if (userLoaded) {
        userId && updater(userId, { lastActive: serverTimestamp() })

        setFilter(user?.metadata?.lastUsedFilter)
      }
    })()
  }, [
    currentUser,
    userTheme,
    error,
    i18n.language,
    userLoaded,
    userId,
    user?.metadata?.lastUsedFilter
  ])

  const updatePreviewer = useCallback(
    preview => {
      const newPreview = getPreview(preview)
      debounceUpdater({ previewer: newPreview })
    },
    [debounceUpdater]
  )

  const updateFilter = useCallback(
    filter => {
      const newFilter = getFilter(filter)
      setFilter(newFilter)
      debounceUpdater({ filter: newFilter })
    },
    [debounceUpdater]
  )

  const value = useMemo(
    () => ({
      ...user,
      preferences: {
        // default values
        theme: userTheme,
        lang: i18n.language,
        previewer: 'list',
        // **************
        ...user?.preferences,
        locale: getLocale(i18n.language)
      },
      metadata: {
        ...user?.metadata,
        lastUsedFilter: filter
      },
      userLoaded,
      uid: currentUser?.uid,
      update: updater,
      updateLastActive,
      updatePreviewer,
      updateFilter
    }),
    [
      user,
      userLoaded,
      currentUser,
      updatePreviewer,
      updateFilter,
      filter,
      userTheme,
      i18n.language,
      updateLastActive
    ]
  )

  if (!userLoaded)
    return <CircleLoader height='100dvh' text={t('loadingUser')} />

  return (
    <UserContext.Provider value={value}>
      <Outlet />
    </UserContext.Provider>
  )
}
