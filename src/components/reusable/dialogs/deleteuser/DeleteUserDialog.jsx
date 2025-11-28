import Dialog from '../Dialog'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'

import { useTranslation } from 'react-i18next'
import useUser from '@hooks/useUser'
import useLoadResources from '@hooks/useLoadResources'

export default function DeleteUserDialog({
  onAccept,
  onClose,
  open,
  setPassword,
  password,
  error,
  setError,
  provider
}) {
  const { preferences } = useUser()
  const { t } = useTranslation(['common', 'dialogs', 'profile'])
  const loadingResources = useLoadResources(['dialogs'])

  const handleChange = e => {
    setPassword(e.target.value)
    setError(null)
  }

  return (
    <Dialog
      title='deleteUser.title'
      onAccept={onAccept}
      onClose={onClose}
      open={open}
      titleLoaded={!loadingResources}
      acceptTitle={t('delete_x', { x: '', ns: 'common' })}>
      <Typography color={`warning.${preferences.theme}`}>
        {t('deleteUser.text', { ns: 'dialogs' })}
      </Typography>
      {provider === 'password' && (
        <TextField
          sx={{ mt: 2 }}
          label={t('deleteUser.passwordLabel', { ns: 'profile' })}
          onChange={handleChange}
          value={password}
          error={!!error}
          helperText={error}
        />
      )}
    </Dialog>
  )
}
