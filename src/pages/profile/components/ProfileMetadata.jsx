import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import useAuth from '@hooks/useAuth'
import useUser from '@hooks/useUser'
import { memo, useRef } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import { useTheme } from '@mui/material/styles'

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import formatTimeAgo from '@utils/formatTimeAgo'

gsap.registerPlugin(SplitText)

export default memo(function ProfileMetadata() {
  const { currentUser } = useAuth()
  const { t } = useTranslation('profile')
  const { preferences } = useUser()
  const locale = preferences?.locale
  const containerRef = useRef(null)
  const theme = useTheme()

  useGSAP(() => {
    if (!currentUser?.metadata) return

    const targets = gsap.utils.toArray('.metadata-text', containerRef.current)
    const split = new SplitText(targets, { type: 'chars, words' })

    gsap.from(split.chars, {
      opacity: 0,
      color: theme.palette.secondary.main,
      textShadow: `0 0 8px ${theme.palette.secondary.main}`,
      y: 10,
      rotateX: -90,
      rotateZ: -45,
      stagger: 0.02,
      ease: 'expo.out',
      delay: 0.8
    })
  }, { scope: containerRef, dependencies: [currentUser?.metadata] })

  if (!currentUser?.metadata) return null

  const createdDate = new Date(currentUser.metadata?.creationTime)
  const lastLogin = new Date(currentUser.metadata?.lastSignInTime)

  return (
    <Box
      className='flex flex-column'
      alignItems='center'
      sx={{
        gap: 1,
        perspective: '1000px',
        perspectiveOrigin: '0 50%'
      }}
      ref={containerRef}>
      <Typography variant='body2'>
        {t('accountCreated')}
        <span className='metadata-text'>
          {' '}{formatTimeAgo(createdDate, locale)}
        </span>
      </Typography>
      <Typography variant='body2'>
        {t('lastLogin')}
        <span className='metadata-text'>
          {' '}{formatTimeAgo(lastLogin, locale)}
        </span>
      </Typography>
    </Box>
  )
})
