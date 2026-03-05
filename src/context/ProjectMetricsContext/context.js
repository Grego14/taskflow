import { createContext } from 'react'

const ProjectMetricsContext = createContext({
  pendingTasks: 0,
  completedTasks: {
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    thisMonth: 0
  },
  completedOnTime: {
    total: 0,
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    thisMonth: 0
  },
  overdueTasks: 0,
  tasksInProgress: {
    total: 0,
    dueToday: 0
  }
})

export default ProjectMetricsContext
