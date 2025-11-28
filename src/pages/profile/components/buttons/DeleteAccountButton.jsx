import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'

import { useCallback, useState, lazy, Suspense } from 'react'

const DeleteUserDialog = lazy(
  () => import('@components/reusable/dialogs/deleteuser/DeleteUserDialog')
)

import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/firebase/AuthContext'
import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  reauthenticateWithPopup
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import lazyImport from '@utils/lazyImport'
import { keyframes } from '@mui/material/styles'
import { githubProvider, googleProvider } from '@/firebase/firebase-config'

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
`

export default function DeleteAccountButton() {
  const { t } = useTranslation('profile')
  const { currentUser } = useAuth()
  const { preferences, uid } = useUser()
  const { appNotification } = useApp()
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [popup, setPopup] = useState(false)

  const provider = currentUser?.providerData?.[0]?.providerId

  const deleteAccount = useCallback(() => {
    ;(async () => {
      if (!password) return setError(t('deleteUser.errors.password'))

      try {
        setDeleting(true)
        const deleteUserDocs = await lazyImport('/src/services/deleteUser')
        await deleteUserDocs(uid)

        const handleUserDeletion = async () => {
          await deleteUser(currentUser).catch(error => {
            appNotification({
              message: t('deleteUser.errors.deletingUser'),
              status: 'error'
            })
          })

          setPopup(false)
          navigate('/')
        }

        const handleError = () => {
          appNotification({
            message: t('deleteUser.errors.authenticating'),
            status: 'error'
          })
        }

        if (provider === 'google.com' || provider === 'github.com') {
          setPopup(true)
        }

        if (provider === 'password') {
          // authenticate the user and delete his Auth
          reauthenticateWithCredential(
            currentUser,
            EmailAuthProvider.credential(currentUser.email, password)
          ).catch(handleError)
        } else if (provider === 'google.com') {
          await reauthenticateWithPopup(currentUser, googleProvider)
            .then(handleUserDeletion)
            .catch(handleError)
        } else if (provider === 'github.com') {
          await reauthenticateWithPopup(currentUser, githubProvider)
            .then(handleUserDeletion)
            .catch(handleError)
        }
      } catch (err) {
        console.error(err)
        appNotification({
          message: t('deleteUser.errors.deletingUser'),
          status: 'error'
        })
      }
      setDeleting(false)
    })()
  }, [appNotification, uid, t, currentUser, navigate, password, provider])

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant='outlined'
        disabled={popup || !!error}
        endIcon={
          !deleting ? (
            <DeleteIcon
              sx={[
                theme => ({ color: theme.palette.error[preferences.theme] })
              ]}
            />
          ) : (
            <HourglassBottomIcon
              sx={{
                animation: `${spin} 1s infinite alternate`
              }}
            />
          )
        }
        color='error'>
        {t('deleteAccount')}
      </Button>

      {open && (
        <Suspense>
          <DeleteUserDialog
            onAccept={deleteAccount}
            onClose={() => setOpen(false)}
            open={open}
            setPassword={setPassword}
            password={password}
            error={error}
            setError={setError}
            provider={provider}
          />
        </Suspense>
      )}
    </>
  )
}
