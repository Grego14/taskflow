import useAuth from '@hooks/useAuth'
import { useCallback, useState, useMemo } from 'react'

export default function useReauthenticate() {
  const { currentUser } = useAuth()
  const provider = currentUser?.providerData?.[0]?.providerId

  const [popup, setPopup] = useState(false)

  const reauthenticate = useCallback(
    password => {
      return new Promise((resolve, reject) => {
        if (!password && provider === 'password') return 'password'

        if (provider === 'password') {
          import('firebase/auth').then(async mod => {
            const { EmailAuthProvider, reauthenticateWithCredential } = mod
            await reauthenticateWithCredential(
              currentUser,
              EmailAuthProvider.credential(currentUser.email, password)
            ).then(
              () => resolve({ error: null, success: true }),
              () => reject({ error: 'authenticating', success: false })
            )
          })
        }

        if (provider === 'github.com' || provider === 'google.com') {
          setPopup(true)
          // get the github/google provider and reauthenticate the user
          import('firebase/auth').then(async mod => {
            const {
              GithubAuthProvider,
              GoogleAuthProvider,
              reauthenticateWithPopup
            } = mod

            const googleProvider = new GoogleAuthProvider()
            googleProvider.addScope('email')

            const githubProvider = new GithubAuthProvider()
            githubProvider.addScope('email')

            const authProvider =
              provider === 'google.com' ? googleProvider : githubProvider

            await reauthenticateWithPopup(currentUser, authProvider).catch(
              () => {
                reject({ error: 'authenticating', success: false })
                setPopup(false)
              }
            )

            resolve({ error: null, success: true })
            setPopup(false)
          })
        }
      })
    },
    [provider, currentUser]
  )

  const value = useMemo(
    () => ({
      reauthenticate,
      popup,
      provider
    }),
    [reauthenticate, popup, provider]
  )

  return value
}
