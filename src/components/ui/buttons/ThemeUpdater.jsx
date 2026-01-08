import useUser from '@hooks/useUser'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import IconButton from '@mui/material/IconButton'
import { useColorScheme } from '@mui/material/styles'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function ThemeUpdater() {
  const { t } = useTranslation('ui')
  const { setMode } = useColorScheme()
  const { update, uid, preferences, setUser } = useUser()
  const userTheme = preferences.theme

  const updateTheme = useCallback(() => {
    const newTheme = userTheme === 'dark' ? 'light' : 'dark'
    setMode(newTheme)
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, theme: newTheme }
    }))

    if (uid) update(uid, { theme: userTheme })
  }, [userTheme, setMode, update, uid])

  return (
    <IconButton
      onClick={updateTheme}
      aria-label={t('buttons.changeTheme_theme', {
        theme: userTheme === 'light' ? 'dark' : 'light'
      })}>
      {userTheme === 'dark' ? (
        <LightModeIcon fontSize='small' />
      ) : (
        <DarkModeIcon fontSize='small' />
      )}
    </IconButton>
  )
}
