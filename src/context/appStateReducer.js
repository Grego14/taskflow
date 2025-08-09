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
  if (
    !Object.values(ACTION_TYPES).some(type => type === action.type) ||
    !action.payload === undefined
  )
    return state

  const payload = action.payload
  const user = state.user

  switch (action.type) {
    case ACTION_TYPES.UPDATE_USER:
      return { ...state, user: { ...user, ...payload } }

    case ACTION_TYPES.UPDATE_LOADING:
      return { ...state, loading: payload }

    case ACTION_TYPES.UPDATE_ERROR:
      return { ...state, error: payload }

    // Update appState preferences and localStorage items
    case ACTION_TYPES.UPDATE_PREFERENCES: {
      const theme = payload?.theme || user.preferences.theme
      const lang = payload?.lang || user.preferences.lang
      const uiPrefs = payload?.ui

      const newUIPrefs = { ...user.preferences.ui, ...uiPrefs }

      localStorage.setItem('theme', theme)
      localStorage.setItem('lang', lang)
      localStorage.setItem('ui', JSON.stringify(newUIPrefs))

      return {
        ...state,
        user: {
          ...user,
          preferences: {
            theme,
            lang,
            ui: newUIPrefs
          }
        }
      }
    }

    // Update appState actualProject, actualProjectData and localStorage item
    case ACTION_TYPES.UPDATE_ACTUAL_PROJECT: {
      const { id, data } = payload
      const newData = { ...state.actualProjectData, ...data }

      localStorage.setItem('actualProject', id)

      return {
        ...state,
        actualProject: id,
        actualProjectData: newData
      }
    }

    case ACTION_TYPES.UPDATE_PROJECTS: {
      return {
        ...state,
        user: { ...state, projects: payload }
      }
    }

    default:
      return state
  }
}

export function initAppState() {
  const uiPrefs = JSON.parse(localStorage.getItem('ui'))

  return {
    user: {
      preferences: {
        lang: localStorage.getItem('lang') || 'en',
        theme: localStorage.getItem('theme') || 'light',
        ui: {
          drawerOpen: uiPrefs.drawerOpen || false,
          lastUsedPreviewer:
            uiPrefs.lastUsedPreviewer && uiPrefs.lastUsedPreviewer === 'kanban'
              ? 'kanban'
              : 'list'
        }
      },
      projects: null
    },
    actualProject: localStorage.getItem('lastEditedProject') || null,
    actualProjectData: null,
    loading: true,
    error: null
  }
}
