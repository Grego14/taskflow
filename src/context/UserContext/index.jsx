import { Outlet } from 'react-router-dom'

// hooks
import useAuth from '@hooks/useAuth'
import useDebounce from '@hooks/useDebounce'
import { useColorScheme } from '@mui/material/styles'
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

const getPreview = preview => (preview === 'list' ? 'list' : 'kanban')
const getFilter = filter => FILTERS.find(f => f === filter) || 'default'

export default function UserProvider() {
  const { i18n } = useTranslation('ui')
  const { currentUser, isOffline } = useAuth()
  const userId = currentUser?.uid
  const { mode, systemMode, setMode } = useColorScheme()
  const userTheme = mode === 'system' ? systemMode : mode

  // use a local filter so the user see the filter update faster. Also allow
  // filtering tasks when the user has no connection
  const [filter, setFilter] = useState('default')
  const [userLoaded, setUserLoaded] = useState(false)
  const [user, setUser] = useState({
    preferences: {
      // default values
      theme: userTheme,
      lang: i18n.language,
      previewer: 'list',
      locale: getLocale(i18n.language)
    },
    metadata: {
      lastUsedFilter: filter,
      lastEditedProject: '',
      lastEditedProjectOwner: '',
      lastUsedMetricFilter: ''
    },
    profile: {
      username: currentUser?.displayName || '',
      avatar: currentUser?.photoURL || '',
      email: currentUser?.email || ''
    }
  })

  // functions only available if the user is logged
  const [updaters, setUpdaters] = useState({
    update: null,
    updatePreviewer: null,
    updateFilter: null
  })

  // update MUI internal theme and i18next internal language if the user db
  // fields are different from the local ones (the user changes the theme/lang
  // when he was on the Landing Page)
  useEffect(() => {
    if (userId && user?.preferences?.theme !== userTheme) {
      setMode(user.preferences.theme === 'light' ? 'light' : 'dark')
    }

    if (userId && user?.preferences?.lang !== i18n.language) {
      i18n.changeLanguage(user?.preferences?.lang)
    }
  }, [user, userTheme, setMode, i18n, userId])

  const value = useMemo(
    () => ({
      ...user,
      metadata: {
        ...user.metadata,
        lastUsedFilter: filter
      },
      preferences: {
        ...user.preferences,
        theme: userTheme
      },
      setUser,
      userLoaded,
      setUserLoaded,
      uid: currentUser?.uid,
      setFilter,
      ...updaters,
      setUpdaters
    }),
    [user, currentUser, userLoaded, updaters, filter, userTheme]
  )

  return (
    <UserContext.Provider value={value}>
      <Outlet />
    </UserContext.Provider>
  )
}
