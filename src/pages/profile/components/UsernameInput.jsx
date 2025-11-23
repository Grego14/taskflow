import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'

export default function UsernameInput({ error, field }) {
  const { t } = useTranslation('profile')

  return (
    <TextField
      label={t('labels.username')}
      error={!!error}
      helperText={error?.message}
      {...field}
    />
  )
}
