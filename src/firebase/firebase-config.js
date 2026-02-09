import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'taskflow-ef99b.firebaseapp.com',
  databaseURL: 'https://taskflow-ef99b-default-rtdb.firebaseio.com',
  projectId: 'taskflow-ef99b',
  storageBucket: 'taskflow-ef99b.firebasestorage.app',
  appId: '1:713417388789:web:20d2f37f5e792028e84bbc',
  measurementId: 'G-QR77L7MXGH'
})

const auth = getAuth(app)

export { app, auth }
