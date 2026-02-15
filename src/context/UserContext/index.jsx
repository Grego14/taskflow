// hooks
import useAuth from '@hooks/useAuth'
import { useColorScheme } from '@mui/material/styles'
import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
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
      lang: i18n.language || 'en',
      previewer: 'list',
      locale: getLocale(i18n.language || 'en')
    },
    metadata: {
      lastUsedFilter: 'default',
      lastEditedProject: '',
      lastEditedProjectOwner: '',
      lastUsedMetricFilter: ''
    },
    profile: {
      username: currentUser?.username || '',
      avatar: currentUser?.avatar || '',
      email: currentUser?.email || ''
    }
  })

  const updatePlaceholder = useRef(null)

  // function to update the user document, only available if the user is logged
  const update = useCallback((data) => {
    if (updatePlaceholder.current) {
      return updatePlaceholder.current(data)
    }
  }, [])

  // update MUI internal theme and i18next internal language if the user db
  // fields are different from the local ones (the user changes the theme/lang
  // when he was on the Landing Page, but he has other theme on the db)
  useEffect(() => {
    if (!userId || !userLoaded) return

    const { theme, lang } = user.preferences

    if (theme && theme !== userTheme) {
      setMode(theme)
    }

    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang)
    }
  }, [user?.preferences, setMode, i18n, userId, userTheme, userLoaded])

  const value = useMemo(
    () => ({
      ...user,
      metadata: {
        ...user.metadata
      },
      preferences: {
        ...user.preferences,
        locale: getLocale(user.preferences.lang)
      },
      setUser,
      userLoaded,
      setUserLoaded,
      uid: userId,
      update,
      setUpdateImplementation: (fn) => { updatePlaceholder.current = fn }
    }),
    [user, currentUser, userLoaded, update, i18n]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
