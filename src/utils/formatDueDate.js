export default function formatDueDate(date, locale) {
  if (!(date instanceof Date)) return ''

  const now = new Date()
  const today = now.getDate()
  const thisMonth = now.getMonth()

  const day = date.getDate()
  const month = date.getMonth()

  const dueTomorrow = day + 1 > today && day < today && thisMonth === month
  const dueToday = day === today && month === thisMonth
  const isOverdue = date < now

  const text = (() => {
    if (dueTomorrow) return 'tomorrow'
    if (isOverdue) return 'overdue'
    if (dueToday) return 'today'

    // return a date text with year, month and day if the task state is not one of
    // the above
    const formatter = Intl.DateTimeFormat(locale, { dateStyle: 'short' })

    return formatter.format(date)
  })()

  const state = dueTomorrow || dueToday || isOverdue

  return {
    date: text,
    translate: state,
    state: { tomorrow: dueTomorrow, today: dueToday, overdue: isOverdue }
  }
}
