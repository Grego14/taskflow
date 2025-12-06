import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function LoginButton(props) {
  const { variant = 'text', color = 'inherit', ...other } = props
  const { t } = useTranslation()

  const navigate = useNavigate()

  return (
    <Button
      onClick={() => navigate('/login')}
      {...other}
      variant={variant}
      color={color}>
      {t('login')}
    </Button>
  )
}
