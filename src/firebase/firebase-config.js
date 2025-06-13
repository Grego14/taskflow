import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'tdsg-7287f.firebaseapp.com',
  databaseURL: 'https://tdsg-7287f-default-rtdb.firebaseio.com',
  projectId: 'tdsg-7287f',
  storageBucket: 'tdsg-7287f.firebasestorage.app',
  messagingSenderId: '465353553643',
  appId: '1:465353553643:web:3a5570dfb0ef294eb6f0ae'
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')

export const githubProvider = new GithubAuthProvider()
githubProvider.addScope('email')

export {
  auth,
  db,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
}
