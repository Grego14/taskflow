import GoBackButton from '@components/reusable/buttons/GoBackButton'
// components
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import Box from '@mui/material/Box'
import ProfileButtons from './components/ProfileButtons'
import ProfileForm from './components/ProfileForm'
import ProfileMetadata from './components/ProfileMetadata'

import { useAuth } from '@/firebase/AuthContext'
// hooks
import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import useLoadResources from '@hooks/useLoadResources.js'

export default function Profile() {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const { currentUser } = useAuth()
  const [params, setParams] = useSearchParams()
  const location = useLocation()

  // save the project id on the searchParams to avoid losing the "fromProject"
  // if the user reloads the /profile rute
  useEffect(() => {
    if (location.state?.fromProject) {
      setParams({
        fromProject: location.state?.fromProject,
        fromAction: location.state?.fromAction || ''
      })
    }
  }, [location, setParams])

  const { lastRute } = useApp()
  const { preferences } = useUser()

  const loadingResources = useLoadResources([
    'profile',
    'validations',
    'selectors'
  ])
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true)

  if (loadingResources)
    return (
      <CircleLoader text={t('loading', { ns: 'common' })} height='100dvh' />
    )

  const fromProject = params.get('fromProject')
  const fromAction = params.get('fromAction')

  return (
    <Box className='flex flex-column' alignItems='center' gap={4} p='2rem 1rem'>
      <GoBackButton
        handler={() =>
          navigate(
            fromProject ? `/projects/${fromProject}${fromAction}` : '/',
            {
              // the LayoutAppBar uses the "projectAction" to check which layout
              // it should render
              state: {
                lastRute: '/profile',
                fromProject,
                projectAction: fromAction
              }
            }
          )
        }
        sx={{ mr: 'auto' }}
      />

      <ProfileForm setSaveBtnDisabled={setSaveBtnDisabled} />
      <ProfileMetadata />
      <ProfileButtons saveBtnDisabled={saveBtnDisabled} />
    </Box>
  )
}
