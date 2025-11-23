const TASKS_TYPES = {
  UPDATE_TITLE: 'update_title',
  UPDATE_PRIORITY: 'update_priority',
  UPDATE_DUEDATE: 'update_dueDate',
  UPDATE_LABELS: 'update_labels',
  UPDATE_MEMBERS: 'update_members'
}

export const initialValue = {
  title: '',
  dueDate: 'nodate',
  priority: 'none',
  labels: [],
  members: [],
  status: 'todo'
}

export function tasksReducer(state, action) {
  if (
    !Object.values(TASKS_TYPES).some(type => type === action.type) ||
    action.payload === undefined
  )
    return state

  const payload = action.payload

  // maybe use this functions to trim and adapt the data?
  switch (action.type) {
    case TASKS_TYPES.UPDATE_TITLE:
      return { ...state, title: payload }

    case TASKS_TYPES.UPDATE_PRIORITY:
      return { ...state, priority: payload }

    case TASKS_TYPES.UPDATE_LABELS:
      return { ...state, labels: payload }

    case TASKS_TYPES.UPDATE_MEMBERS:
      return { ...state, members: payload }

    case TASKS_TYPES.UPDATE_DUEDATE:
      return { ...state, dueDate: payload }

    default:
      return state
  }
}
