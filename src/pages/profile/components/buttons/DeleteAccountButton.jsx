import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'

import { Suspense, lazy, useCallback, useState } from 'react'

const DeleteUserDialog = lazy(
  () => import('@components/reusable/dialogs/deleteuser/DeleteUserDialog')
)

import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import useReauthenticate from '@hooks/useReauthenticate'

import lazyImport from '@utils/lazyImport'

export default function DeleteAccountButton() {
  const { t } = useTranslation('profile')
  const { currentUser } = useAuth()
  const { preferences, uid } = useUser()
  const { appNotification } = useApp()
  const navigate = useNavigate()

  const [deleting, setDeleting] = useState(false)
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { reauthenticate, popup, reauthenticateError, provider } =
    useReauthenticate()

  const deleteAccount = useCallback(() => {
    ;(async () => {
      try {
        const { success } = await reauthenticate(password)

        const deleteUserDocs = await lazyImport('/src/services/deleteUser')
        await deleteUserDocs(uid)

        await import('firebase/auth').then(async mod => {
          const { deleteUser } = mod
          setDeleting(true)

          await deleteUser(currentUser).catch(error => {
            appNotification({
              message: t('deleteUser.errors.deletingUser'),
              status: 'error'
            })
          })

          navigate('/')
        })
      } catch (err) {
        if (err.error) {
          const errorMsg = t(`deleteUser.errors.${err.error}`)

          setError(errorMsg)
          appNotification({ message: errorMsg, status: 'error' })
        }

        setDeleting(false)
      }
    })()
  }, [appNotification, password, reauthenticate, t, currentUser, navigate, uid])

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant='outlined'
        disabled={popup || !!error}
        endIcon={
          <DeleteIcon
            sx={[theme => ({ color: theme.palette.error[preferences.theme] })]}
          />
        }
        color='error'>
        {t('deleteAccount')}
      </Button>

      {open && (
        <Suspense fallback={null}>
          <DeleteUserDialog
            onAccept={deleteAccount}
            onClose={() => setOpen(false)}
            open={open}
            setPassword={setPassword}
            password={password}
            error={error}
            setError={setError}
            provider={provider}
            popup={popup}
            deleting={deleting}
          />
        </Suspense>
      )}
    </>
  )
}
