import Alert from '@mui/material/Alert'
import Slide from '@mui/material/Slide'
import Snackbar from '@mui/material/Snackbar'

import { globalAlert, closeGlobalAlert } from '@stores/ui'

export default function GlobalAlert() {
  const notification = globalAlert.value

  if (!notification) return null

  return (
    <Snackbar
      sx={{ 
        width: 'fit-content', 
        ml: 'auto', 
        zIndex: t => t.zIndex.globalAlert 
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={notification.open}
      autoHideDuration={notification.autoHideDuration || 3000}
      resumeHideDuration={1000}
      onClose={(ev, reason) => {
        notification.onClose?.()
        closeGlobalAlert()
      }}
      slots={{ transition: Slide }}
      slotProps={{ transition: { in: notification.open } }}>
      <Alert
        icon={notification.icon}
        onClose={closeGlobalAlert}
        severity={notification.status}
        action={notification.action}>
        {notification.message}
      </Alert>
    </Snackbar>
  )
}
