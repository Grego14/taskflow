import setPageTitle from '@utils/setPageTitle'

let interval = null
const TASKFLOW = 'TaskFlow'

export default function flashTitle(message) {
  if (interval) clearInterval(interval)

  // get the actual title before updating it and delete the "TaskFlow - " prefix
  const currentFullTitle = document.title
  const pageName = currentFullTitle.replace(`${TASKFLOW} - `, '')

  let showMsg = true

  interval = setInterval(() => {
    // alternate between the alert message and the original
    document.title = showMsg ? message : `${TASKFLOW} - ${pageName}`
    showMsg = !showMsg
  }, 1000)

  const stopFlash = () => {
    clearInterval(interval)

    // send the original pageName so setPageTitle adds the prefix again
    setPageTitle(pageName)
    window.removeEventListener('mousemove', stopFlash)
    window.removeEventListener('click', stopFlash)
    window.removeEventListener('focus', stopFlash)
  }

  window.addEventListener('mousemove', stopFlash)
  window.addEventListener('click', stopFlash)
  window.addEventListener('focus', stopFlash)
}
