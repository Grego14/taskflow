function createDueDate(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export default createDueDate
