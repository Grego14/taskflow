import Typography from '@mui/material/Typography'
import Notification from './Notification'

import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

export default function KickedNotification({ data }) {
  const { t } = useTranslation('ui')

  if (
    !data?.notificationDate ||
    !data?.id ||
    !data?.kickedBy ||
    !data?.projectName
  )
    return null

  return (
    <Notification
      data={data}
      title={
        <Typography sx={{ textWrap: 'wrap' }}>
          {t('notifications.kicked')}{' '}
          <Typography component='span' color='primary' fontWeight={600}>
            {data.projectName}
          </Typography>{' '}
          {t('notifications.kicked2')}{' '}
          <Typography component='span' color='info' fontWeight={600}>
            {data.kickedBy}
          </Typography>
        </Typography>
      }
      showDelete
    />
  )
}
