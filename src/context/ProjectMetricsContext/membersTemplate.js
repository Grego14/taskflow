export default function getMembersTemplate() {
  return {
    assignedTasks: {
      total: 0,
      completed: 0,
      completedOnTime: 0,
      cancelled: 0,
      pending: 0,
      overdue: 0
    },
    completedTasks: {
      today: 0,
      yesterday: 0,
      lastWeek: 0,
      thisWeek: 0,
      thisMonth: 0,
      total: 0
    },
    completedOnTime: {
      total: 0,
      today: 0,
      yesterday: 0,
      lastWeek: 0,
      thisWeek: 0,
      thisMonth: 0
    },
    cancelledTasks: {
      total: 0,
      today: 0,
      yesterday: 0,
      lastWeek: 0,
      thisWeek: 0,
      thisMonth: 0
    }
  }
}
