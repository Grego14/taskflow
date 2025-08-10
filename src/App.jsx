import { useCallback, useEffect, useRef } from 'react'
import { useAuth } from './firebase/AuthContext'
import './App.css'
import { db } from '@/firebase/firebase-config.js'
import useDebounce from '@hooks/useDebounce'
import getFriendlyAuthError from '@utils/getFriendlyAuthError'
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  getDocs,
  query,
  where,
  documentId
} from 'firebase/firestore'
import AppRoutes from './AppRoutes.jsx'
import { useAppState } from './context/AppContext'
import AppProvider from './context/AppContext'

export default function App() {
  const { currentUser } = useAuth()
  const {
    updateUser,
    updateError,
    updateLoading,
    updateProjects,
    user,
    actualProjectData,
    updateActualProject,
    updatePreferences
  } = useAppState()

  const userId = currentUser?.uid
  const lastProjectMembers = useRef(actualProjectData?.members)

  const savePreferences = useCallback(
    async function savePreferences(newPrefs) {
      if (!userId) return

      try {
        const userDoc = doc(db, 'users', userId)
        await updateDoc(userDoc, {
          'preferences.ui': newPrefs
        })
      } catch (err) {
        console.error(err)
        throw getFriendlyAuthError(err.message).message
      }
    },
    [userId]
  )

  const [debouncePrefsSaver, cancelPrefsSaver] = useDebounce(
    savePreferences,
    1200
  )

  // save the preferences after 1.2 seconds
  useEffect(() => {
    debouncePrefsSaver(user.preferences?.ui)
    return () => cancelPrefsSaver()
  }, [user.preferences?.ui, debouncePrefsSaver, cancelPrefsSaver])

  useEffect(() => {
    ;(async function getUserProjects() {
      try {
        if (!userId) return

        const projectsRef = collection(db, 'users', userId, 'projects')

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
  }, [userId, updateProjects, updateError])

  useEffect(() => {
    if (!userId) return

    const userDocRef = doc(db, 'users', userId)

    // Listen changes in the user document
    const unsubscribe = onSnapshot(
      userDocRef,
      docSnap => {
        updateLoading(true)

        const exists = docSnap.exists()
        const data = docSnap.data()

        if (exists) {
          updateUser(data)
          updatePreferences(data.preferences)
        } else {
          updateError('User document not found')
        }

        updateLoading(false)
      },
      err => updateError(err)
    )

    return () => unsubscribe()
  }, [userId, updateLoading, updateError, updateUser, updatePreferences])

  // get project members profiles
  useEffect(() => {
    async function getProjectMembers() {
      if (!actualProjectData?.members) return

      const usersRef = collection(db, 'users')
      const q = query(
        usersRef,
        where(documentId(), 'in', actualProjectData.members)
      )

      const membersSnapshot = await getDocs(q)
      const membersProfiles = membersSnapshot.docs.map(snap => {
        const data = snap.data()

        return {
          id: snap.id,
          ...data.profile
        }
      })

      updateActualProject({
        id: actualProjectData.id,
        data: { membersData: membersProfiles }
      })
    }

    getProjectMembers()
  }, [actualProjectData?.members, actualProjectData?.id, updateActualProject])

  return <AppRoutes />
}
