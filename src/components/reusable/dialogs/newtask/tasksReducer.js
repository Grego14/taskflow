export const initialValue = {
  title: '',
  dueDate: 'nodate',
  priority: 'none',
  labels: [],
  members: [],
  status: 'todo'
}

export function tasksReducer(state, action) {
  const { type, payload } = action

  if (state[type] !== undefined) {
    return { ...state, [type]: payload }
  }

  return state
}
