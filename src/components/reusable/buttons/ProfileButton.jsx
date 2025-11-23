// components
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { useAuth } from '@/firebase/AuthContext'
// hooks
import useUser from '@hooks/useUser'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

export default function ProfileButton({
  open,
  showTexts,
  tooltipPosition = 'top',
  onlyIcon = false,
  fromAction,
  sx
}) {
  const navigate = useNavigate()
  const { t } = useTranslation('ui')
  const { projectId } = useParams()

  const { isOffline, currentUser } = useAuth()
  const { profile } = useUser()
  const avatar = profile?.avatar

  const deviceCanHover = useMediaQuery('(hover: hover)')
  const profileComponentPreLoaded = useRef(false)

  const borderColor = isOffline ? 'red' : 'green'
  const username = profile?.username || currentUser?.displayName
  const email = profile?.email || currentUser?.email

  const onlyBadge = Boolean(open && showTexts)

  const preloadProfileComponent = async () => {
    if (!profileComponentPreLoaded.current) {
      await import('@pages/profile/Profile.jsx')

      profileComponentPreLoaded.current = true
    }
  }

  return (
    <Tooltip
      title={t('buttons.profileButtonLabel')}
      placement={tooltipPosition}>
      <Button
        disableRipple={onlyIcon}
        onClick={() =>
          navigate('/profile', {
            state: { fromProject: projectId || '', fromAction }
          })
        }
        onMouseEnter={preloadProfileComponent}
        sx={{
          borderRadius: onlyIcon ? '50%' : 0,
          ...(onlyIcon && { p: 0 }),
          ...sx
        }}
        aria-label={t('buttons.profileButtonLabel')}>
        <Badge
          variant='dot'
          overlap='circular'
          anchorOrigin={{ vertical: 'bottom' }}
          color={isOffline ? 'error' : 'success'}
          sx={{
            mr: onlyBadge ? 2 : 0,
            scale: open ? '1' : '0.7',
            transition: 'scale .25s ease-in-out'
          }}>
          <Avatar
            alt={`${username} avatar`}
            src={avatar}
            sx={{
              border: `2px solid ${borderColor}`
            }}
          />
        </Badge>

        {showTexts && open && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '.1rem',
              alignItems: 'start'
            }}>
            <Typography
              sx={{
                opacity: open ? 1 : 0,
                width: open ? 'auto' : 0,
                fontSize: 'var(--fs-small, .95rem)',
                color: 'text.primary'
              }}>
              {username}
            </Typography>
            <Typography
              variant='caption'
              sx={{
                opacity: open ? 1 : 0,
                width: open ? 'auto' : 0,
                fontSize: 'var(--fs-tiny, .8rem)',
                color: 'text.secondary'
              }}>
              {email}
            </Typography>
          </Box>
        )}
      </Button>
    </Tooltip>
  )
}
