import {
  red,
  orange,
  purple,
  blue,
  blueGrey,
  grey,
  lightBlue,
  yellow,
  lightGreen,
  green
} from '@mui/material/colors'

export const QUERY_STALE_TIME = 1 * 60 * 1000

export const priorities = ['urgent', 'high', 'medium', 'low', 'none']
export const statuses = ['todo', 'done', 'doing', 'cancelled']

export const priorityColors = (() => {
  const getColor = (color) => [color[200], color[50]]

  return {
    urgent: getColor(red),
    high: getColor(orange),
    medium: getColor(green),
    low: getColor(blue),
    none: [blueGrey[200], blueGrey[50]]
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
  'auth',
  'landing',
  'metrics',
  'notifications',
  'projects',
  'tasks',
  'preview'
]

export const ONE_DAY_MS = 86400000

export const DRAWER_CONFIG = { widthOpen: 260, widthClosed: 64 }
export const APPBAR_HEIGHT = { mobile: '3.8rem', other: '3.4rem' }
