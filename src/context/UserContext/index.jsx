// hooks
import useAuth from '@hooks/useAuth'
import { useColorScheme } from '@mui/material/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

// utils
import getLocale from '@utils/getLocale'
import UserContext from './context.js'

export default function UserProvider({ children }) {
  const { i18n } = useTranslation('ui')
  const { currentUser, isOffline } = useAuth()
  const userId = currentUser?.uid
  const { mode, systemMode, setMode } = useColorScheme()
  const userTheme = mode === 'system' ? systemMode : mode

  const [userLoaded, setUserLoaded] = useState(false)
  const [user, setUser] = useState({
    // default values
    preferences: {
      theme: userTheme,
      lang: i18n.language,
      previewer: 'list',
      locale: getLocale(i18n.language)
    },
    metadata: {
      lastUsedFilter: 'default',
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

  // function to update the user document, only available if the user is logged
  const [update, setUpdate] = useState(null)

  // update MUI internal theme and i18next internal language if the user db
  // fields are different from the local ones (the user changes the theme/lang
  // when he was on the Landing Page, but he has other theme on the db)
  useEffect(() => {
    const existsAndEqualsTo = (field, equalTo) =>
      user?.preferences?.[field] && user?.preferences?.[field] !== equalTo

    if (userId && existsAndEqualsTo('theme', userTheme)) {
      setMode(user.preferences.theme === 'light' ? 'light' : 'dark')
    }

    if (userId && existsAndEqualsTo('theme', i18n.language)) {
      i18n.changeLanguage(user?.preferences?.lang)
    }
  }, [user, setMode, i18n, userId, userTheme])

  const value = useMemo(
    () => ({
      ...user,
      metadata: {
        ...user.metadata
      },
      preferences: {
        ...user.preferences,
        locale: getLocale(i18n.language)
      },
      setUser,
      userLoaded,
      setUserLoaded,
      uid: currentUser?.uid,
      update,
      setUpdate
    }),
    [user, currentUser, userLoaded, update, i18n]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
