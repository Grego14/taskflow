import Typography from '@mui/material/Typography'
import Notification from './Notification'

import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

export default function WelcomeNotification({ data }) {
  const { profile } = useUser()
  const { t } = useTranslation('ui')

  if (!data?.notificationDate || !data?.id) return null

  return (
    <Notification
      data={data}
      title={
        <Typography>
          {t('notifications.welcome')}{' '}
          <Typography component='span' color='primary' fontWeight={600}>
            {profile?.username}
          </Typography>
        </Typography>
      }
      showDelete
    />
  )
}
