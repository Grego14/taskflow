export default function formatTimer(s) {
  const totalSeconds = Math.max(0, s)

  const hour = Math.floor(totalSeconds / 3600)
  const minute = Math.floor((totalSeconds % 3600) / 60)
  const second = totalSeconds % 60

  const parts = [minute, second].map(v => v < 10 ? '0' + v : v)

  // if there are hours, add them to the start
  if (hour > 0) {
    parts.unshift(hour < 10 ? '0' + hour : hour)
  }

  return parts.join(':')
}

