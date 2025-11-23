import { signIn, signUp } from '@/firebase/auth.js'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import { updateProfile } from 'firebase/auth'

async function login({ email, password }) {
  try {
    const user = await signIn(email, password)

    if (user) return user
  } catch (err) {
    throw getFriendlyAuthError(err.message)
  }
}

async function signup({ username, email, password }) {
  try {
    const user = await signUp(email, password)

    if (user) {
      await updateProfile(user, { displayName: username })
      return user
    }
  } catch (err) {
    throw getFriendlyAuthError(err.message)
  }
}

export default { login, signup }
