import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AppTooltip from '../AppTooltip'
import Typography from '@mui/material/Typography'

import useAuth from '@hooks/useAuth'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import useLoadResources from '@hooks/useLoadResources'
import useLayout from '@hooks/useLayout'
import useRoute from '@hooks/useRoute'

import '@styles/components/ui/buttons/profileButton.css'

const preloadProfileComponent = async () => {
  try {
    await import('@pages/profile/Profile.jsx')
  } catch (err) {
    console.error('ProfileButton: error preloading the Profile component.')
  }
}

export default function ProfileButton({
  showTexts,
  tooltipPosition = 'top',
  onlyIcon = false,
  className
}) {
  const { t } = useTranslation('ui')
  const { navigateTo } = useRoute()
  const { isPreview, triggerUpsell } = useLayout()
  const { isOffline, currentUser } = useAuth()
  const { profile } = useUser()

  const avatar = profile?.avatar || currentUser?.avatar
  const username = profile?.username || currentUser?.username
  const email = profile?.email || currentUser?.email

  // we use this component on the Landing page so we need to get the ui
  // resources...
  useLoadResources('ui')

  const statusColor = isOffline 
    ? 'var(--mui-palette-error-main)' 
    : 'var(--mui-palette-success-main)'

  const onlyIconClass = onlyIcon ? 'profile-btn--only-icon' : ''
  const classNames = `profile-btn ${onlyIconClass} ${className}`

  return (
    <AppTooltip
      title={t('buttons.profileButtonLabel')}
      placement={tooltipPosition}>
      <Button
        disableRipple={onlyIcon}
        onClick={() => isPreview
          ? triggerUpsell('profile')
          : navigateTo('/profile')}
        onMouseEnter={!isPreview ? preloadProfileComponent : null}
        style={{ '--profile-status-color': statusColor }}
        aria-label={t('buttons.profileButtonLabel')}
        className={classNames}>
        <Badge
          className={`profile-btn-avatar ${showTexts ? 'hide-element' : ''}`}
          variant='dot'
          overlap='circular'
          anchorOrigin={{ vertical: 'bottom' }}
          color={isOffline ? 'error' : 'success'}>
          <Avatar alt={`${username} avatar`} src={avatar} />
        </Badge>

        {showTexts && (
          <Box 
            className='hide-element profile-btn-text flex flex-column absolute'>
            <Typography className='profile-btn-name'>
              {username}
            </Typography>
            {email && (
              <Typography className='profile-btn-email' variant='caption'>
                {email}
              </Typography>
            )}
          </Box>
        )}
      </Button>
    </AppTooltip>
  )
}
