import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import { Suspense, lazy, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useApp from '@hooks/useApp'
import useAuth from '@hooks/useAuth'
import useUser from '@hooks/useUser'
import useReauthenticate from '@hooks/useReauthenticate'

const DeleteUserDialog = lazy(
  () => import('@components/reusable/dialogs/deleteuser/DeleteUserDialog')
)

const getIconSx = (preferences) => (theme) => ({
  color: theme.palette.error[preferences.theme]
})

export default function DeleteAccountButton() {
  const { t } = useTranslation('profile')
  const { preferences, uid } = useUser()
  const { appNotification } = useApp()
  const { reauthenticate, popup } = useReauthenticate()

  const [deleting, setDeleting] = useState(false)
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const deleteAccount = useCallback(async () => {
    try {
      const { success, error: authError } = await reauthenticate(password)

      if (!success) {
        if (authError) {
          const msg = t(`deleteUser.errors.${authError}`)
          setError(msg)
          appNotification({ message: msg, status: 'error' })
        }
        return
      }

      setDeleting(true)

      const [
        { default: deleteUserDocs },
        { deleteUser },
        { auth }
      ] = await Promise.all([
        import('@services/deleteUser'),
        import('firebase/auth'),
        import('@/firebase/firebase-config')
      ])

      await deleteUserDocs(uid)

      await deleteUser(auth.currentUser)

      location.assign('/')
    } catch (err) {
      console.error('Error deleting account:', err)
      appNotification({
        message: t('deleteUser.errors.deletingUser'),
        status: 'error'
      })
      setDeleting(false)
    }
  }, [appNotification, password, reauthenticate, t, uid])

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant='outlined'
        disabled={popup || !!error}
        endIcon={<DeleteIcon sx={getIconSx(preferences)} />}
        color='error'
      >
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
            popup={popup}
            deleting={deleting}
          />
        </Suspense>
      )}
    </>
  )
}
