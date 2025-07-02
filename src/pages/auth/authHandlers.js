import { signIn, signUp } from '@/firebase/auth.js'
import { updateProfile } from 'firebase/auth'

async function login(email, password) {
  console.log('Email %s; Password %s', email, password)

  try {
    const loginData = await signIn(email, password)

    if (loginData) {
      console.log('Logged successfully', loginData)
    }

    return loginData
  } catch (error) {
    console.error('Log In Error: ', error.message)
  }
}

async function signup(username, email, password) {
  console.log('Username %s; Email %s; Password %s', username, email, password)
  try {
    const signUpData = await signUp(email, password)

    if (signUpData) {
      console.log('Account created successfully.', signUpData)

      // Change the auth.displayName to "username"
      await updateProfile(signUpData, { displayName: username })
    }

    return signUpData
  } catch (error) {
    console.error('Sign Up Error: ', error.message)
  }
}

export const authHandlers = {
  login,
  signup
}
