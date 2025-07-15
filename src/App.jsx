import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo
} from 'react'
import { useAuth } from './firebase/AuthContext'
import './App.css'
import getFriendlyAuthError from '@utils/getFriendlyAuthError'
import { doc, onSnapshot, getDocs, collection } from 'firebase/firestore'
import AppRoutes from './AppRoutes.jsx'
import { db } from '@/firebase/firebase-config.js'

const AppContext = createContext({
  updatePreferences: () => console.warn('No provider found'),
  updateActualProject: () => console.warn('No provider found'),
  setUser: () => console.warn('No provider found'),
  user: {
    preferences: {
      lang: localStorage.getItem('lang') || 'en',
      theme: localStorage.getItem('theme') || 'light'
    }
  },
  actualProject: localStorage.getItem('lastEditedProject') || null,
  loading: false,
  error: null
})

export default function App() {
  const { isOffline, currentUser, userDoc } = useAuth()

  const [appState, setAppState] = useState(() => ({
    user: {
      preferences: {
        lang: localStorage.getItem('lang') || 'en',
        theme: localStorage.getItem('theme') || 'light'
      }
    },
    actualProject: localStorage.getItem('lastEditedProject') || null,
    loading: false,
    error: null
  }))

  // Update localStorage items
  useEffect(() => {
    if (appState.user?.preferences) {
      localStorage.setItem('lang', appState.user.preferences.lang)
      localStorage.setItem('theme', appState.user.preferences.theme)
    }
  }, [appState.user?.preferences])

  useEffect(() => {
    async function getUserProjects() {
      try {
        if (!currentUser?.uid) return

        const projectsRef = collection(db, 'users', currentUser.uid, 'projects')
        const projectsData = await getDocs(projectsRef)

        if (!projectsData.empty)
          setUser({ projects: projectsData.docs.map(data => data.data()) })
      } catch (err) {
        console.error(err)
        throw getFriendlyAuthError(err.message).message
      }
    }

    getUserProjects()
  }, [currentUser?.uid])

  // listen changes in the user document and update them
  useEffect(() => {
    if (!currentUser?.uid) return

    const userDocRef = doc(db, 'users', currentUser.uid)

    const unsubscribe = onSnapshot(userDocRef, docSnap => {
      setAppState(prev => ({ ...prev, loading: true }))

      if (docSnap.exists()) {
        setUser(docSnap.data())
      } else {
        setAppState(prev => ({ ...prev, error: 'User document not found' }))
      }

      setAppState(prev => ({ ...prev, loading: false }))
    })

    return () => unsubscribe()
  }, [currentUser?.uid])

  const updatePreferences = useCallback(newPrefs => {
    setAppState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        preferences: {
          ...prev.user?.preferences,
          ...newPrefs
        }
      }
    }))
  }, [])

  const updateActualProject = useCallback(newProject => {
    setAppState(prev => ({
      ...prev,
      actualProject: newProject || null
    }))

    localStorage.setItem('lastEditedProject', newProject)
  }, [])

  const setUser = useCallback(userData => {
    setAppState(prev => ({ ...prev, user: { ...prev.user, ...userData } }))
  }, [])

  const contextValue = useMemo(
    () => ({
      ...appState,
      updatePreferences,
      setUser,
      updateActualProject
    }),
    [appState, setUser, updatePreferences, updateActualProject]
  )

  return (
    <AppContext.Provider value={contextValue}>
      <AppRoutes />
    </AppContext.Provider>
  )
}

export function useUser() {
  return useContext(AppContext)
}
