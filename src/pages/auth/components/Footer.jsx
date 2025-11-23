import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Link from '@components/reusable/Link'

import { useTranslation } from 'react-i18next'

export default function Footer({ navigate, isSignup, type }) {
  const { t } = useTranslation(['auth', 'common'])

  const nextRute = isSignup ? 'login' : 'signup'

  return (
    <div className='text-center'>
      <Link to='/recover-password'>
        {t('login.recoverPassword', { ns: 'auth' })}
      </Link>

      <Box className='flex flex-center' gap={2} mt={2}>
        <Typography variant='body2'>
          {t(`${type}.accountText`, { ns: 'auth' })}
        </Typography>

        <Link onClick={() => navigate(`/${nextRute}`)} to={`/${nextRute}`}>
          {t(nextRute, { ns: 'common' })}
        </Link>
      </Box>
    </div>
  )
}
