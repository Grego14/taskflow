import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback
} from 'react'
import {
  appStateReducer,
  initAppState,
  ACTION_TYPES
} from './appStateReducer.js'

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
  actualProjectData: null,
  loading: true,
  error: null
})

export default function AppProvider({ children }) {
  const [appState, dispatch] = useReducer(appStateReducer, {}, initAppState)

  const updateUser = useCallback(user => {
    dispatch({ type: ACTION_TYPES.UPDATE_USER, payload: user })
  }, [])

  const updateLoading = useCallback(state => {
    dispatch({ type: ACTION_TYPES.UPDATE_LOADING, payload: state })
  }, [])

  const updateError = useCallback(err => {
    dispatch({ type: ACTION_TYPES.UPDATE_ERROR, payload: err })
  }, [])

  const updateProjects = useCallback(projects => {
    dispatch({ type: ACTION_TYPES.UPDATE_PROJECTS, payload: projects })
  }, [])

  const updatePreferences = useCallback(preferences => {
    dispatch({ type: ACTION_TYPES.UPDATE_PREFERENCES, payload: preferences })
  }, [])

  const updateActualProject = useCallback(project => {
    dispatch({ type: ACTION_TYPES.UPDATE_ACTUAL_PROJECT, payload: project })
  }, [])

  const contextValue = useMemo(
    () => ({
      ...appState,
      updateUser,
      updateLoading,
      updateError,
      updateProjects,
      updatePreferences,
      updateActualProject
    }),
    [
      appState,
      updateUser,
      updateLoading,
      updateError,
      updateProjects,
      updatePreferences,
      updateActualProject
    ]
  )

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppContext)

  if (!context) throw Error('useAppState must be used within AppProvider')

  return context
}
