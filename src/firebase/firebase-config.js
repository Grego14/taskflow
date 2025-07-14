import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'

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
  authDomain: 'taskflow-ef99b.firebaseapp.com',
  databaseURL: 'https://taskflow-ef99b-default-rtdb.firebaseio.com',
  projectId: 'taskflow-ef99b',
  storageBucket: 'taskflow-ef99b.firebasestorage.app',
  messagingSenderId: '713417388789',
  appId: '1:713417388789:web:20d2f37f5e792028e84bbc',
  measurementId: 'G-QR77L7MXGH'
}

const app = initializeApp(firebaseConfig)
const db = initializeFirestore(app, { localCache: persistentLocalCache })
const auth = getAuth(app)

// TODO - See what can we do with the analytics...
const analytics = getAnalytics(app)

export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')

export const githubProvider = new GithubAuthProvider()
githubProvider.addScope('email')

export {
  auth,
  db,
  analytics,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
}
