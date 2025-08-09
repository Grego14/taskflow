export default function formatTimestamp({ seconds, nanoseconds }, locale) {
  if (!seconds || !nanoseconds) return { date: '', time: '' }

  const date = new Date(seconds * 1000 + nanoseconds / 1000000)

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'full'
  })

  const timeFormatter = new Intl.DateTimeFormat(locale, {
    timeStyle: 'short'
  })

  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date),
    complete: new Intl.DateTimeFormat(locale, {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(date),
    raw: date
  }
}
