import useTasks from '@hooks/useTasks'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

export default function Retry() {
  const { t } = useTranslation('common')
  const { refetchTasks } = useTasks()

  return (
    <Button
      onClick={refetchTasks}
      variant='contained'
      sx={{ fontWeight: 'bold', width: 'fit-content' }}>
      {t('retry')}
    </Button>
  )
}
