import { auth } from '@/firebase/firebase-config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth'
import notificationService from './notification'
import createUserDoc from './createUserDoc'

export const login = async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  return user
}

export const signup = async ({ email, password, username, preferences }) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(user, { displayName: username })

  await sendEmailVerification(user)

  // create user db document
  const { locale, ...otherPrefs } = preferences
  await createUserDoc(user, otherPrefs)

  await notificationService.sendWelcome(user.uid)

  return user
}

export const resendVerification = async () => {
  const user = auth.currentUser
  if (!user) throw new Error('NO_USER')

  return await sendEmailVerification(user)
}
