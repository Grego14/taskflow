export default function getDateByKey(day) {
  const taskDate = new Date()
  taskDate.setHours(23)
  taskDate.setMinutes(59)
  const today = taskDate.getDate()

  switch (day) {
    case 'nodate':
      return null
    case 'today':
      return taskDate
    case 'tomorrow':
      taskDate.setDate(today + 1)
      return taskDate
    case 'twodays':
      taskDate.setDate(today + 2)
      return taskDate
    case 'oneweek':
      taskDate.setDate(today + 7)
      return taskDate
    case 'twoweeks':
      taskDate.setDate(today + 14)
      return taskDate
    case 'onemonth':
      taskDate.setMonth(taskDate.getMonth() + 1)
      return taskDate
    default:
      return taskDate
  }
}
