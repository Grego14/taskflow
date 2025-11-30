import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

export default function SignUpButton(props) {
  const { variant = 'contained', color = 'white', ...other } = props
  const { t } = useTranslation()

  return (
    <Button
      type='button'
      onClick={() => location.assign('signup')}
      {...other}
      variant={variant}>
      {t('signup')}
    </Button>
  )
}
