import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

export default function SaveProfileButton({ disabled }) {
  const { t } = useTranslation('profile')

  return (
    <Button
      disabled={disabled}
      variant='contained'
      type='submit'
      form='profileForm'>
      {t('updateBtn')}
    </Button>
  )
}
