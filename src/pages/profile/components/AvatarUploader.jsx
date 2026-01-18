// components
import ErrorMessage from '@components/reusable/errormessage/ErrorMessage'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// hooks
import useAuth from '@hooks/useAuth'
import useUser from '@hooks/useUser'
import { memo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

// button that appears at the bottom right of the avatar uploader
const bottomIconStyles = {
  position: 'absolute',
  bottom: 0,
  right: 0
}

// in this component we only use the value and the onChange properties of
// the field prop
export default memo(function AvatarUploader({ error, field }) {
  const { currentUser } = useAuth()
  const { profile, preferences } = useUser()
  const { t } = useTranslation('profile')
  const username = profile?.username || currentUser?.displayName

  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [showUploadIcon, setShowUploadIcon] = useState(false)

  function handleInputClick() {
    fileInputRef.current.click()
  }

  const handleMouseEnter = e => {
    setShowUploadIcon(true)
  }

  const handleMouseLeave = e => {
    setShowUploadIcon(false)
  }

  return (
    <Box className='flex flex-column flex-center' gap={2}>
      <Typography>{t('labels.avatar')}</Typography>

      <Box position='relative' width='fit-content'>
        <Avatar
          alt={t('avatarAlt_user', { user: username })}
          src={field.value}
          onClick={handleInputClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={theme => ({
            width: 200,
            height: 200,
            cursor: 'pointer',
            border: `4px solid ${theme.palette.primary.main}`,
            '&:hover': {
              opacity: 0.9
            }
          })}>
          {/* if there isn't an avatar show the initial letter of the username */}
          {!field.value && username?.[0]}
        </Avatar>

        {showUploadIcon && (
          <Box
            className='flex flex-center absolute'
            sx={{
              left: '50%',
              top: '50%',
              width: '100%',
              height: '100%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
            onClick={handleInputClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <CloudUploadIcon
              color='secondary'
              fontSize='large'
              aria-label={t('labels.uploadPicture')}
            />
          </Box>
        )}

        {!showUploadIcon &&
          (uploading ? (
            <CircularProgress
              size={48}
              sx={{ color: 'primary', ...bottomIconStyles }}
            />
          ) : (
            <IconButton
              color='primary'
              aria-label={t('labels.uploadPicture')}
              onClick={handleInputClick}
              sx={[
                theme => {
                  const backgroundColor =
                    theme.palette.grey[preferences.theme === 'dark' ? 900 : 100]

                  return {
                    backgroundColor,
                    ...bottomIconStyles,
                    border: `4px solid ${theme.palette.primary.main}`,
                    transition: 'scale .2s ease-out',
                    '&:hover': {
                      scale: 1.25,
                      backgroundColor
                    }
                  }
                }
              ]}>
              <CameraAltIcon />
            </IconButton>
          ))}
      </Box>

      {error && (
        <ErrorMessage
          error={error.message}
          className='text-balance text-center'
        />
      )}

      <input
        type='file'
        ref={fileInputRef}
        onChange={field.onChange}
        accept='image/jpeg, image/png, image/webp'
        className=''
        style={{ display: 'none' }}
        disabled={uploading}
      />
    </Box>
  )
})
