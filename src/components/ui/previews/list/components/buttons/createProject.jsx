import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

export default function CreateProject() {
  const { t } = useTranslation('ui')

  return (
    <Button
      variant='contained'
      sx={{
        fontWeight: 'bold',
        width: 'fit-content',
        alignSelf: 'center'
      }}
      onClick={() => console.log('creating project to')}>
      {t('projects.createProject')}
    </Button>
  )
}
