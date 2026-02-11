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

export default function ProfileButton({
  open,
  showTexts,
  tooltipPosition = 'top',
  onlyIcon = false,
  sx,
  onClick,
  className
}) {
  const { t } = useTranslation('ui')

  const { isOffline, currentUser } = useAuth()
  const { profile } = useUser()
  const avatar = profile?.avatar

  const profileComponentPreLoaded = useRef(false)

  // we use this component on the Landing page so we need to get the ui
  // resources...
  const loadingResource = useLoadResources('ui')

  const borderColor = isOffline ? 'red' : 'green'
  const username = profile?.username || currentUser?.displayName
  const email =
    profile?.email ||
    currentUser?.email ||
    currentUser?.providerData?.[0]?.email

  const onlyBadge = Boolean(open && showTexts)

  const preloadProfileComponent = async () => {
    try {
      await import('@pages/profile/Profile.jsx')
      profileComponentPreLoaded.current = true
    } catch (err) {
      console.error('ProfileButton: error preloading the Profile component.')
    }
  }

  if (loadingResource) return

  return (
    <Tooltip
      title={t('buttons.profileButtonLabel')}
      placement={tooltipPosition}>
      <Button
        disableRipple={onlyIcon}
        onClick={onClick}
        onMouseEnter={preloadProfileComponent}
        sx={{
          borderRadius: onlyIcon ? '50%' : 0,
          ...(onlyIcon && { p: 0 }),
          ...sx
        }}
        aria-label={t('buttons.profileButtonLabel')}
        className={className}>
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
            className='profile-btn-text'
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
            {email && (
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
            )}
          </Box>
        )}
      </Button>
    </Tooltip>
  )
}
