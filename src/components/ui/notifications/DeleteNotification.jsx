import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'

import useNotifications from '@hooks/useNotifications'
import { useTranslation } from 'react-i18next'

export default function DeleteNotification(props) {
  const { id, ...other } = props
  const { t } = useTranslation('common')

  const { deleteNotification } = useNotifications()

  return (
    <Button
      data-notification-id={id}
      color='error'
      sx={{ mr: 'auto' }}
      {...other}
      onClick={deleteNotification}
      startIcon={<DeleteIcon fontSize='small' />}>
      {t('delete_x', { ns: 'common', x: '' })}
    </Button>
  )
}
