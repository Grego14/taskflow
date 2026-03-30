import GoBackButton from '@components/reusable/buttons/GoBackButton'
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import Box from '@mui/material/Box'
import ProfileButtons from './components/ProfileButtons'
import ProfileForm from './components/ProfileForm'
import ProfileMetadata from './components/ProfileMetadata'

import useLoadResources from '@hooks/useLoadResources.js'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useApp from '@hooks/useApp'
import useRoute from '@hooks/useRoute'

export default function Profile() {
  const { lastRute, navigateTo } = useRoute()
  const { t } = useTranslation('common')

  const loadingResources = useLoadResources(['profile', 'validations', 'ui'])
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true)

  if (loadingResources)
    return <CircleLoader text={t('loading')} height='100dvh' />

  return (
    <Box className='flex flex-column' alignItems='center'
      sx={{
        gap: 4,
        py: 4,
        px: 2,
        background: (t) => t.palette.background.profile,
        backgroundSize: '125% 125%',
        animation: 'profileGradient 7.5s ease infinite',
        transition: 'background 0.3s ease'
      }}>
      <GoBackButton handler={() => navigateTo(lastRute)} sx={{ mr: 'auto' }} />

      <ProfileForm setSaveBtnDisabled={setSaveBtnDisabled} />
      <ProfileMetadata />
      <ProfileButtons saveBtnDisabled={saveBtnDisabled} />
    </Box>
  )
}
