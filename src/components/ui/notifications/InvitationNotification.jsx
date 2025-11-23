import GoToProjectIcon from '@mui/icons-material/ChevronRight'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import DeleteNotification from './DeleteNotification'
import Notification from './Notification'

import useNotifications from '@hooks/useNotifications'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { isInviteNotification } from './notificationsUtils'

export default function InvitationNotification({ data, closeMenu }) {
  const { t } = useTranslation('ui')
  const navigate = useNavigate()

  const { onDecline, onAccept } = useNotifications()

  if (isInviteNotification(data)) return null

  const datasets = {
    'data-notification-id': data.id,
    'data-project-owner': data.projectOwner,
    'data-project-id': data.projectId
  }

  return (
    <Notification
      data={data}
      title={
        <Typography sx={{ textWrap: 'wrap' }}>
          {t('notifications.invitation_user', {
            user: data.invitedBy,
            ns: 'ui'
          })}{' '}
          <Typography
            component='span'
            color='primary'
            sx={[theme => ({ ...theme.typography.h6 })]}>
            {data.projectName}
          </Typography>
        </Typography>
      }
      content={
        !data.declined ? (
          !data.accepted ? (
            <>
              <Button onClick={onDecline} {...datasets}>
                {t('decline', { ns: 'common' })}
              </Button>
              <Button
                color='primary'
                variant='contained'
                onClick={onAccept}
                {...datasets}>
                {t('accept', { ns: 'common' })}
              </Button>
            </>
          ) : (
            <Button
              endIcon={<GoToProjectIcon fontSize='small' />}
              variant='contained'
              onClick={() => {
                navigate(`/projects/${data.projectId}?o=${data.projectOwner}`)
                closeMenu()
              }}>
              {t('projects.goToProject')}
            </Button>
          )
        ) : (
          <Typography variant='body2' color='warning'>
            {t('notifications.invitationDeclined')}
          </Typography>
        )
      }
    />
  )
}
