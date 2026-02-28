import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '../Dialog'
import { keyframes } from '@mui/material/styles'
import { Suspense, lazy } from 'react'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'

import useLoadResources from '@hooks/useLoadResources'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import useAuth from '@hooks/useAuth'

const PasswordInput = lazy(
  () => import('@components/reusable/inputs/PasswordInput')
)

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const spinningIconSx = {
  animation: `${spin} 1s infinite`
}

export default function DeleteUserDialog(props) {
  const {
    onAccept,
    setPassword,
    setError,
    password,
    error,
    deleting,
    ...other
  } = props

  const { currentUser } = useAuth()
  const { preferences } = useUser()
  const { t } = useTranslation(['common', 'dialogs', 'profile'])
  const loadingResources = useLoadResources(['dialogs'])

  const isPasswordProvider = currentUser?.providerId === 'password'

  const handleChange = e => {
    setPassword(e.target.value)
    setError(null)
  }

  return (
    <Dialog
      title='deleteUser.title'
      {...other}
      titleLoaded={!loadingResources}
      acceptBtn={
        <Button
          onClick={onAccept}
          disabled={isPasswordProvider ? !!error || deleting : deleting}
          variant='contained'
          endIcon={deleting && <HourglassBottomIcon sx={spinningIconSx} />}>
          {t('delete_x', { x: '', ns: 'common' })}
        </Button>
      }>
      <Typography color={`warning.${preferences.theme}`}>
        {t('deleteUser.text', { ns: 'dialogs' })}
      </Typography>

      {isPasswordProvider && (
        <Suspense fallback={null}>
          <PasswordInput
            onChange={handleChange}
            autoComplete='current-password'
            error={!!error}
            helperText={error}
            name='password'
            label={t('deleteUser.passwordLabel', { ns: 'profile' })}
            sx={{ mt: 2 }}
          />
        </Suspense>
      )}
    </Dialog>
  )
}
