import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'

export default function UsernameInput(props) {
  const { t } = useTranslation('profile')


  return <TextField label={t('labels.username')} {...props} />
}
