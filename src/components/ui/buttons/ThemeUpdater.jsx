import useUser from '@hooks/useUser'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { IconButton } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function ThemeUpdater() {
  const { t } = useTranslation('ui')
  const { mode, systemMode, setMode } = useColorScheme()
  const { update, uid } = useUser()

  const userTheme = mode === 'system' ? systemMode : mode

  const updateTheme = useCallback(() => {
    setMode(userTheme === 'dark' ? 'light' : 'dark')

    if (uid) update(uid, { theme: userTheme })
  }, [userTheme, setMode, update, uid])

  return (
    <IconButton
      onClick={updateTheme}
      aria-label={t('buttons.changeTheme_theme', { theme: userTheme })}>
      {userTheme === 'dark' ? (
        <LightModeIcon fontSize='small' />
      ) : (
        <DarkModeIcon fontSize='small' />
      )}
    </IconButton>
  )
}
