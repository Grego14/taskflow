export const ACTION_TYPES = {
  UPDATE_USER: 'update_user',
  UPDATE_PREFERENCES: 'update_preferences',
  UPDATE_LOADING: 'update_loading',
  UPDATE_ERROR: 'update_error',
  UPDATE_ACTUAL_PROJECT: 'update_actual_project',
  UPDATE_PROJECTS: 'update_projects'
}

export function appStateReducer(state, action) {
  // check against undefined to be able to pass "false"
  if (!action.type || !action.payload === undefined) return state

  switch (action.type) {
    case ACTION_TYPES.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } }

    case ACTION_TYPES.UPDATE_LOADING:
      return { ...state, loading: action.payload }

    case ACTION_TYPES.UPDATE_ERROR:
      return { ...state, error: action.payload }

    // Update appState preferences and localStorage items
    case ACTION_TYPES.UPDATE_PREFERENCES: {
      const theme = action.payload?.theme || state.preferences.theme
      const lang = action.payload?.lang || state.preferences.lang

      localStorage.setItem('theme', theme)
      localStorage.setItem('lang', lang)

      return {
        ...state,
        user: { ...state.user, preferences: { theme, lang } }
      }
    }

    // Update appState actualProject, actualProjectData and localStorage item
    case ACTION_TYPES.UPDATE_ACTUAL_PROJECT: {
      const { id, data } = action.payload

      localStorage.setItem('actualProject', id)

      return {
        ...state,
        actualProject: id,
        actualProjectData: data || null
      }
    }

    case ACTION_TYPES.UPDATE_PROJECTS: {
      return {
        ...state,
        user: { ...state.user, projects: action.payload }
      }
    }

    default:
      return state
  }
}

export function initAppState() {
  return {
    user: {
      preferences: {
        lang: localStorage.getItem('lang') || 'en',
        theme: localStorage.getItem('theme') || 'light'
      },
      projects: null
    },
    actualProject: localStorage.getItem('lastEditedProject') || null,
    actualProjectData: null,
    loading: 'holi2',
    error: null
  }
}
