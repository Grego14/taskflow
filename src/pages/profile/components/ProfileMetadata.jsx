import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useAuth } from '@/firebase/AuthContext'
import useUser from '@hooks/useUser'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import formatTimeAgo from '@utils/formatTimeAgo'

export default memo(function ProfileMetadata() {
  const { currentUser } = useAuth()
  const { t } = useTranslation('profile')
  const { preferences } = useUser()
  const locale = preferences?.locale

  if (!currentUser?.metadata) return null

  const createdDate = new Date(Number(currentUser.metadata?.createdAt))
  const lastLogin = new Date(Number(currentUser.metadata?.lastLoginAt))

  return (
    <Box className='flex flex-column' alignItems='center' gap={1}>
      <Typography>
        {t('accountCreated_date', { date: formatTimeAgo(createdDate, locale) })}
      </Typography>
      <Typography>
        {t('lastLogin_date', { date: formatTimeAgo(lastLogin, locale) })}
      </Typography>
    </Box>
  )
})
