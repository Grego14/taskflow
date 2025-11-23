import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import DeleteNotification from './DeleteNotification'

import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import { getNotificationDate } from './notificationsUtils'

export default function Notification({ data, content, title, showDelete }) {
  const { t } = useTranslation('common')
  const { preferences } = useUser()
  const locale = preferences.locale

  const notificationDate = getNotificationDate(data.notificationDate, locale)

  return (
    <MenuItem>
      <Badge
        color='info'
        variant=''
        badgeContent={data.read ? null : t('new', { ns: 'common' })}>
        <Card sx={{ maxWidth: '20rem' }}>
          <CardHeader
            title={title}
            subheader={
              <Typography color='textSecondary' variant='body2' mt={1}>
                {notificationDate}
              </Typography>
            }
            disableTypography
            sx={{ pb: 0 }}
          />
          <CardContent
            className='flex'
            sx={{ justifyContent: 'end', gap: 2, pt: 1.5 }}>
            {(data.declined || data.accepted || showDelete) && (
              <DeleteNotification id={data.id} />
            )}

            {content}
          </CardContent>
        </Card>
      </Badge>
    </MenuItem>
  )
}
