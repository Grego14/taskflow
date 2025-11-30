import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

export default function LoginButton(props) {
  const { variant = 'text', color = 'inherit', ...other } = props
  const { t } = useTranslation()

  return (
    <Button
      onClick={() => location.assign('/login')}
      {...other}
      variant={variant}
      color={color}>
      {t('login')}
    </Button>
  )
}
