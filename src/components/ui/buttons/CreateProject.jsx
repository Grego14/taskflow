import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function CreateProject({ sx }) {
  const { t } = useTranslation('ui')
  const navigate = useNavigate()

  return (
    <Button
      variant='contained'
      onClick={() => navigate('/projects/new')}
      sx={sx}>
      {t('projects.createProject')}
    </Button>
  )
}
