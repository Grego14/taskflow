export const ACTION_TYPES = {
  NOTIFICATION: 'notification'
}

export function appStateReducer(state, action) {
  // check against undefined to be able to pass "false"
  if (
    !Object.values(ACTION_TYPES).some(type => type === action.type) ||
    !action.payload === undefined
  )
    return state

  const payload =
    typeof action.payload === 'function' ? action.payload() : action.payload
  const user = state.user

  switch (action.type) {
    case ACTION_TYPES.NOTIFICATION: {
      const { message, status, open } = payload
      const isOpen = open || !!message // if theres a message set it open

      return {
        ...state,
        notification: {
          ...payload,
          message,
          status: status || 'success',
          open: isOpen
        }
      }
    }

    default:
      return state
  }
}

export function initAppState() {
  return {
    notification: null,
    isMobile: true,
    appBarHeight: '3.8rem',
    lastRute: '/',
    appNotification: () => {},
    setLastRute: () => {}
  }
}
