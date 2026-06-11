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

import '@styles/pages/profile.css'

export default function Profile() {
  const { lastRute, navigateTo } = useRoute()
  const { t } = useTranslation('common')

  const loadingResources = useLoadResources(['profile', 'validations', 'ui'])
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true)

  if (loadingResources)
    return <CircleLoader text={t('loading')} height='100dvh' />

  return (
    <Box className='flex flex-column profile-container'>
      <GoBackButton 
        handler={() => navigateTo(lastRute)} 
        className='profile__go-back-btn' 
      />

      <ProfileForm setSaveBtnDisabled={setSaveBtnDisabled} />
      <ProfileMetadata />
      <ProfileButtons saveBtnDisabled={saveBtnDisabled} />
    </Box>
  )
}
