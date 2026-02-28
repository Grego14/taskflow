import useAuth from '@hooks/useAuth'
import { useCallback, useState, useMemo } from 'react'

const GOOGLE_ID = 'google.com'
const GITHUB_ID = 'github.com'
const PASSWORD_ID = 'password'

const getSocialProvider = (id, GoogleAuthProvider, GithubAuthProvider) => {
  const provider = id === GOOGLE_ID ? new GoogleAuthProvider() : new GithubAuthProvider()
  provider.addScope('email')
  return provider
}

export default function useReauthenticate() {
  const { currentUser } = useAuth()
  const [popup, setPopup] = useState(false)

  const reauthenticate = useCallback(async (password) => {
    const providerId = currentUser?.providerId
    const email = currentUser?.email

    try {
      if (!password && providerId === PASSWORD_ID) return PASSWORD_ID

      if (providerId === PASSWORD_ID) {
        const [{ auth }, { EmailAuthProvider, reauthenticateWithCredential }] =
          await Promise.all([import('@/firebase/firebase-config'), import('firebase/auth')])
        const credential = EmailAuthProvider.credential(email, password)

        await reauthenticateWithCredential(auth.currentUser, credential)
        return { error: null, success: true }
      }

      if (providerId !== GITHUB_ID && providerId !== GOOGLE_ID) return null

      setPopup(true)

      const [
        { auth },
        { GithubAuthProvider, GoogleAuthProvider, reauthenticateWithPopup }
      ] = await Promise.all([
        import('@/firebase/firebase-config'),
        import('firebase/auth')
      ])

      const authProvider = getSocialProvider(providerId, GoogleAuthProvider, GithubAuthProvider)

      await reauthenticateWithPopup(auth.currentUser, authProvider)

      return { error: null, success: true }
    } catch (err) {
      // console.error('reauthenticate error:', err)
      return { error: 'authenticating', success: false }
    } finally {
      setPopup(false)
    }
  }, [currentUser])

  return useMemo(() => ({
    reauthenticate,
    popup,
  }), [reauthenticate, popup])
}
