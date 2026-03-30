import ErrorMessage from '@components/reusable/errormessage/ErrorMessage'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import useAuth from '@hooks/useAuth'
import useUser from '@hooks/useUser'
import { memo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'

import gsap from 'gsap'

// button that appears at the bottom right of the avatar uploader
const bottomIconStyles = {
  position: 'absolute',
  bottom: 0,
  right: 0
}

export default memo(function AvatarUploader({ error, onChange, value }) {
  const { currentUser } = useAuth()
  const { profile, preferences } = useUser()
  const { t } = useTranslation('profile')
  const username = profile?.username || currentUser?.displayName

  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [showUploadIcon, setShowUploadIcon] = useState(false)

  const containerRef = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    tl.fromTo('#avatar-container',
      {
        scale: 0.8,
        autoAlpha: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        filter: 'blur(10px)'
      },
      {
        autoAlpha: 1,
        scale: 1,
        clearProps: 'filter',
      })
      .from('#camera-button', {
        scale: 0,
        duration: 0.5,
        delay: 0.6,
        ease: 'back.out(2)'
      }, '<0.2')
  }, { scope: containerRef })

  function handleInputClick() {
    fileInputRef.current.click()
  }

  const handleMouseEnter = e => setShowUploadIcon(true)
  const handleMouseLeave = e => setShowUploadIcon(false)

  return (
    <Box ref={containerRef} className='flex flex-column flex-center' gap={2}>
      <Typography>{t('labels.avatar')}</Typography>

      <Box
        width='fit-content'
        id='avatar-container'
        className='hide-element relative'>
        <Avatar
          alt={t('avatarAlt_user', { user: username })}
          src={value}
          onClick={handleInputClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          slotProps={{ img: { fetchPriority: 'high', src: value } }}
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
          {!value && username?.[0]}
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
              id='camera-button'
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
        onChange={onChange}
        accept='image/jpeg, image/png, image/webp'
        className=''
        style={{ display: 'none' }}
        disabled={uploading}
      />
    </Box>
  )
})
