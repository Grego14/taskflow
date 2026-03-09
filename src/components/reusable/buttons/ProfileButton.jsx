// components
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

// hooks
import useAuth from '@hooks/useAuth'
import useUser from '@hooks/useUser'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import useLoadResources from '@hooks/useLoadResources'
import { useNavigate } from 'react-router-dom'

export default function ProfileButton({
  open,
  showTexts,
  tooltipPosition = 'top',
  onlyIcon = false,
  sx,
  className
}) {
  const { t } = useTranslation('ui')
  const navigate = useNavigate()

  const { isOffline, currentUser } = useAuth()
  const { profile } = useUser()
  const avatar = profile?.avatar

  const profileComponentPreLoaded = useRef(false)

  // we use this component on the Landing page so we need to get the ui
  // resources...
  const loadingResource = useLoadResources('ui')

  const borderColor = isOffline ? 'red' : 'green'
  const username = profile?.username || currentUser?.username
  const email = profile?.email || currentUser?.email

  const preloadProfileComponent = async () => {
    try {
      await import('@pages/profile/Profile.jsx')
      profileComponentPreLoaded.current = true
    } catch (err) {
      console.error('ProfileButton: error preloading the Profile component.')
    }
  }

  return (
    <Tooltip
      title={t('buttons.profileButtonLabel')}
      placement={tooltipPosition}>
      <Button
        disableRipple={onlyIcon}
        onClick={() => navigate('/profile')}
        onMouseEnter={preloadProfileComponent}
        sx={{
          borderRadius: onlyIcon ? '50%' : 0,
          ...(onlyIcon && { p: 0 }),
          ...sx
        }}
        aria-label={t('buttons.profileButtonLabel')}
        className={className}>
        <Badge
          className='profile-btn-avatar'
          variant='dot'
          overlap='circular'
          anchorOrigin={{ vertical: 'bottom' }}
          color={isOffline ? 'error' : 'success'}>
          <Avatar
            alt={`${username} avatar`}
            src={avatar}
            sx={{
              border: `2px solid ${borderColor}`
            }}
          />
        </Badge>

        {showTexts && (
          <Box
            className='profile-btn-text flex flex-column'
            sx={{
              alignItems: 'start',
              position: 'absolute',
              left: { xs: '4.25rem', laptop: '3.5rem' }
            }}
            aria-hidden={!open}>
            <Typography
              sx={[theme => ({
                ...theme.typography.subtitle2,
                opacity: 1,
                color: 'text.primary'
              })
              ]}>
              {username}
            </Typography>
            {email && (
              <Typography
                variant='caption'
                sx={[theme => ({
                  ...theme.typography.caption,
                  opacity: 1,
                  color: 'text.secondary'
                })
                ]}>
                {email}
              </Typography>
            )}
          </Box>
        )}
      </Button>
    </Tooltip>
  )
}
