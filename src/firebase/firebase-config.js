import { initializeApp } from 'firebase/app'
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'taskflow-ef99b.firebaseapp.com',
  databaseURL: 'https://taskflow-ef99b-default-rtdb.firebaseio.com',
  projectId: 'taskflow-ef99b',
  storageBucket: 'taskflow-ef99b.firebasestorage.app',
  messagingSenderId: '713417388789',
  appId: '1:713417388789:web:20d2f37f5e792028e84bbc',
  measurementId: 'G-QR77L7MXGH'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')

export const githubProvider = new GithubAuthProvider()
githubProvider.addScope('email')

export {
  app,
  auth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
}
