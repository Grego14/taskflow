import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateEmail,
  verifyBeforeUpdateEmail,
  signOut
} from 'firebase/auth'
import { auth } from '@/firebase/firebase-config'
import userService from '@services/user'
import notificationService from './notification'

const providers = {
  google: new GoogleAuthProvider(),
  github: new GithubAuthProvider()
}

providers.google.addScope('email')
providers.github.addScope('email')

export const login = async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  return user
}

export const loginWithProvider = async (providerId, preferences) => {
  const provider = providers[providerId]
  if (!provider) throw Error('INVALID_PROVIDER')

  const result = await signInWithPopup(auth, provider)
  const { user } = result

  // detection logic for new users in OAuth
  const creationTimestamp = new Date(user.metadata.creationTime).getTime()
  const lastSignInTimestamp = new Date(user.metadata.lastSignInTime).getTime()
  const isNewUser = Math.abs(creationTimestamp - lastSignInTimestamp) < 5000

  if (isNewUser) {
    const { locale, ...otherPrefs } = preferences
    const email = user.email || user.providerData?.[0]?.email

    if (!user.emailVerified && email) {
      // if main email is null, we use verifyBeforeUpdateEmail
      // to send the link AND set the email once verified.
      if (!user.email) {
        await verifyBeforeUpdateEmail(user, email)
      } else {
        await sendEmailVerification(user)
      }
    }

    await userService.create({ ...user, email }, otherPrefs)
    await notificationService.sendWelcome(user.uid)
  }

  return user
}

export const signup = async ({ email, password, username, preferences }) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)

  await updateProfile(user, { displayName: username })

  await sendEmailVerification(user)

  // create user db document
  const { locale, ...otherPrefs } = preferences
  await userService.create({ ...user, email }, otherPrefs)

  await notificationService.sendWelcome(user.uid)

  return user
}

export const resendVerification = async () => {
  const user = auth.currentUser
  if (!user) throw Error('NO_USER')

  const email = user.email || user.providerData?.[0]?.email

  if (!user.email && email) {
    try {
      return await verifyBeforeUpdateEmail(user, email)
    } catch (err) {
      if (error.code === 'auth/requires-recent-login') {
        // this error happens if the session is old. 
        // we should tell the user to re-authenticate.
        throw Error('REAUTHENTICATE_REQUIRED')
      }
    }
  }

  return await sendEmailVerification(user)
}

export const logout = async () => {
  try {
    await signOut(auth)
  } catch (err) {
    throw Error(err.message)
  }
}
