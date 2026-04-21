import useAuth from '@hooks/useAuth'
import { useColorScheme } from '@mui/material/styles'
import { useEffect, useMemo, useState, useCallback, useRef } from 'preact/hooks'
import { useTranslation } from 'react-i18next'

import { getItem } from '@utils/storage'
import getLocale from '@utils/getLocale'
import UserContext from './context.js'

export default function UserProvider({ children }) {
  const { i18n } = useTranslation('ui')
  const { currentUser, isOffline } = useAuth()
  const { mode, systemMode, setMode } = useColorScheme()
  const userTheme = mode === 'system' ? systemMode : mode

  const isPreviewPath = location.pathname.startsWith('/preview')

  const [userLoaded, setUserLoaded] = useState(isPreviewPath)
  const [user, setUser] = useState(() => {
    const baseState = {
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
    }

    if (isPreviewPath) {
      const demoData = getItem('preview')

      if(!demoData) return baseState

      const savedUser = demoData.user

      if (savedUser) {
        return {
          ...baseState,
          profile: { ...baseState.profile, ...savedUser.profile },
          preferences: { ...baseState.preferences, ...savedUser.preferences },
          metadata: { ...baseState.metadata, ...savedUser.metadata },
          uid: savedUser.uid
        }
      }
    }

    return baseState
  })

  const userId = currentUser?.uid || user?.uid
  const updatePlaceholder = useRef(null)

  // function to update the user document/local storage data
  const update = useCallback((data) => {
    if (updatePlaceholder) return updatePlaceholder.current?.(data)
  }, [])

  // update MUI internal theme and i18next internal language if the user db
  // fields are different from the local ones (the user changes the theme/lang
  // when he was on the Landing Page, but he has other theme on the db)
  useEffect(() => {
    const { theme, lang } = user.preferences

    if (theme && theme !== userTheme) setMode(theme)
    if (lang && lang !== i18n.language) i18n.changeLanguage(lang)
  }, [user?.preferences, setMode, i18n, userId, userTheme])

  const value = useMemo(
    () => ({
      ...user,
      metadata: { ...user.metadata },
      preferences: {
        ...user.preferences,
        locale: getLocale(user.preferences.lang)
      },
      setUser,
      userLoaded,
      setUserLoaded,
      uid: userId,
      update,
      updatePlaceholder
    }),
    [user, userLoaded, update, userId]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
