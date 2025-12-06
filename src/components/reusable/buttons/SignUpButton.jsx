import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function SignUpButton(props) {
  const { variant = 'contained', color = 'white', ...other } = props
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Button
      type='button'
      onClick={() => navigate('signup')}
      {...other}
      variant={variant}>
      {t('signup')}
    </Button>
  )
}
