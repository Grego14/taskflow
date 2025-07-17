import { useEffect } from 'react'
import { useAuth } from './firebase/AuthContext'
import './App.css'
import { db } from '@/firebase/firebase-config.js'
import getFriendlyAuthError from '@utils/getFriendlyAuthError'
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore'
import AppRoutes from './AppRoutes.jsx'
import { useAppState } from './context/AppContext'
import AppProvider from './context/AppContext'

export default function App() {
  const { currentUser } = useAuth()
  const { updateUser, updateError, updateLoading, updateProjects } =
    useAppState()

  useEffect(() => {
    ;(async function getUserProjects() {
      try {
        if (!currentUser?.uid) return

        const projectsRef = collection(db, 'users', currentUser.uid, 'projects')

        // Listen changes in the user projects
        const unsubscribe = onSnapshot(
          projectsRef,
          snap => {
            const exists = !snap.empty

            if (exists) {
              updateProjects(snap.docs.map(data => data.data()))
            }
          },
          err => updateError(err)
        )
      } catch (err) {
        console.error(err)
        throw getFriendlyAuthError(err.message).message
      }
    })()
  }, [currentUser?.uid, updateProjects, updateError])

  useEffect(() => {
    if (!currentUser?.uid) return

    const userDocRef = doc(db, 'users', currentUser.uid)

    // Listen changes in the user document
    const unsubscribe = onSnapshot(
      userDocRef,
      docSnap => {
        updateLoading(true)

        const exists = docSnap.exists()

        if (exists) {
          updateUser(docSnap.data())
        } else {
          updateError('User document not found')
        }

        updateLoading(false)
      },
      err => updateError(err)
    )

    return () => unsubscribe()
  }, [currentUser?.uid, updateLoading, updateError, updateUser])

  return <AppRoutes />
}
