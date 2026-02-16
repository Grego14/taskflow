import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import CheckIcon from '@mui/icons-material/CheckCircleOutline'
import ClearIcon from '@mui/icons-material/HighlightOff'
import { useTranslation } from 'react-i18next'

const itemStyles = (theme) => ({
  display: 'flex',
  flexDirection: 'column',
  p: 2,
  mb: 2,
  borderRadius: '16px',
  bgcolor: theme.palette.background.paper,
  border: `1px solid ${theme.alpha(theme.palette.divider, 0.08)}`,
  boxShadow: `0 4px 20px ${theme.alpha('#000', 0.03)}`,
  position: 'relative',
  width: '100%',
  maxWidth: '30rem'
})

export default function NotificationItem({
  notification,
  onAccept,
  onDecline,
  onDelete
}) {
  const { t } = useTranslation('notifications')
  const {
    type,
    id,
    projectName,
    invitedBy,
    kickedBy,
    projectOwner,
    projectId
  } = notification

  const isInvitation = type === 'invitation'
  const tOptions = { projectName, invitedBy, kickedBy }

  return (
    <Box id={`notif-${id}`} className='notification-card' sx={itemStyles}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography
          variant='caption'
          color='primary'
          sx={{
            fontWeight: 800,
            letterSpacing: 1.2,
            textTransform: 'uppercase'
          }}>
          {t(`types.${type}.title`)}
        </Typography>
        <IconButton
          size='small'
          onClick={() => onDelete(id)}
          sx={{
            mt: -0.5,
            opacity: 0.5,
            '&:hover': { opacity: 1, color: 'error.main' }
          }}
        >
          <DeleteIcon fontSize='small' />
        </IconButton>
      </Box>

      <Typography
        variant='body2'
        color='text.secondary'
        sx={{ mt: 1, mb: isInvitation ? 2 : 0 }}>
        {t(`types.${type}.message`, tOptions)}
      </Typography>

      {isInvitation
        && !notification.accepted
        && !notification.declined && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant='contained'
              size='small'
              startIcon={<CheckIcon />}
              onClick={onAccept}
              data-notification-id={id}
              data-project-owner={projectOwner}
              data-project-id={projectId}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: 'none'
              }}>
              {t('actions.accept')}
            </Button>
            <Button
              variant='outlined'
              size='small'
              color='inherit'
              startIcon={<ClearIcon />}
              onClick={onDecline}
              data-notification-id={id}
              data-project-owner={projectOwner}
              data-project-id={projectId}
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              {t('actions.decline')}
            </Button>
          </Box>
        )}
    </Box>
  )
}
