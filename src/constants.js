import {
  blue,
  grey,
  lightBlue,
  lightGreen,
  orange,
  purple,
  red,
  yellow
} from '@mui/material/colors'

export const QUERY_STALE_TIME = 1 * 60 * 1000

export const priorities = ['urgent', 'high', 'medium', 'low', 'none']
export const statuses = ['todo', 'done', 'doing', 'cancelled']

export const priorityColors = (() => {
  const getColor = color => [color?.[900], color?.[50]]
  return {
    urgent: getColor(red),
    high: getColor(orange),
    medium: getColor(purple),
    low: getColor(blue),
    none: getColor(grey)
  }
})()

export const statusesColors = (() => {
  const getColor = color => [color?.[900], color?.[50]]
  return {
    done: getColor(lightGreen),
    doing: getColor(yellow),
    todo: getColor(lightBlue),
    cancelled: getColor(grey)
  }
})()

export const FILTERS = [
  'default',
  'todo',
  'doing',
  'done',
  'cancelled',
  'overdue',
  'assignedToMe'
]

export const DATES = [
  'nodate',
  'today',
  'tomorrow',
  'twodays',
  'oneweek',
  'twoweeks',
  'onemonth'
]

export const RESOURCES = [
  'common',
  'ui',
  'profile',
  'validations',
  'dialogs',
  'tooltips',
  'templates',
  'selectors',
  'auth',
  'landing',
  'metrics'
]
