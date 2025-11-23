import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth } from './firebase-config'

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    return userCredential.user
  } catch (error) {
    throw Error(error.message)
  }
}

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return userCredential.user
  } catch (error) {
    throw Error(error.message)
  }
}

export const logOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    throw Error(error.message)
  }
}

export const onAuthStateChange = callback => {
  return onAuthStateChanged(auth, callback)
}
