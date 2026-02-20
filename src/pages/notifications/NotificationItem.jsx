import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import CheckIcon from '@mui/icons-material/CheckCircleOutline'
import ClearIcon from '@mui/icons-material/HighlightOff'
import ErrorIcon from '@mui/icons-material/ReportProblemOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos'

import { useTranslation } from 'react-i18next'
import { useRef } from 'preact/compat'
import { useNavigate } from 'react-router-dom'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

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
  const navigate = useNavigate()

  const cardRef = useRef(null)
  const { contextSafe } = useGSAP({ scope: cardRef })

  const {
    type,
    id,
    projectName,
    invitedBy,
    kickedBy,
    projectOwner,
    projectId,
    error,
    accepted,
    declined
  } = notification

  const isInvitation = type === 'invitation'
  const isProjectMissing = error === 'PROJECT_NOT_FOUND'
  const isKicked = type === 'kicked'
  const tOptions = { projectName, invitedBy, kickedBy }

  // shake animation if theres an action error
  useGSAP(() => {
    if (error) {
      gsap.fromTo(cardRef.current,
        { x: -4 },
        { x: 0, duration: 0.1, repeat: 3, yoyo: true, ease: 'linear' }
      )
    }
  }, [error])

  const goToProject = () => {
    navigate(`/projects/${projectOwner}/${projectId}`)
  }

  return (
    <Box
      ref={cardRef}
      id={`notif-${id}`}
      className='notification-card'
      sx={itemStyles}>
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
          aria-label={t('actions.delete')}
        >
          <DeleteIcon fontSize='small' />
        </IconButton>
      </Box>

      <Typography
        variant='body2'
        color='text.secondary'
        sx={{
          mt: 1, mb: isInvitation
            ? isProjectMissing
              ? 1 : 2
            : 0
        }}>
        {t(`types.${type}.message`, tOptions)}

        {(isInvitation || isKicked) && (
          <Typography component='span' fontWeight={500} color='info'>{' '}{projectName}</Typography>
        )}

        {isKicked && (
          <Typography component='span'>
            {' '}{t('types.kicked.message2', { kickedBy })}
          </Typography>
        )}
      </Typography>

      {accepted && !isProjectMissing && (
        <Button
          size='small'
          color='info'
          onClick={goToProject}
          // use important to override the icon default size
          endIcon={<ArrowForwardIcon sx={{ fontSize: '10px !important' }} />}
          sx={{
            alignSelf: 'flex-start',
            textTransform: 'none',
            fontWeight: 600,
            p: 0,
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
          }}
        >
          {t('actions.goToProject')}
        </Button>
      )}

      {declined && (
        <Typography variant='caption' sx={{ fontStyle: 'italic', opacity: 0.6 }}>
          {t('status.declined')}
        </Typography>
      )}

      {/* missing project (deleted before the user accept/decline the invitation) */}
      {isProjectMissing && (
        <Box sx={{
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'error.main',
          bgcolor: theme => theme.alpha(theme.palette.error.main, 0.05),
          p: 1,
          borderRadius: '8px'
        }}>
          <ErrorIcon fontSize='small' />
          <Typography variant='caption' sx={{ fontWeight: 600 }}>
            {t('errors.projectNotFound')}
          </Typography>
        </Box>
      )}

      {isInvitation && !accepted && !declined &&
        (<Box sx={{ display: 'flex', gap: 1 }}>
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
