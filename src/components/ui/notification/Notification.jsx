import useApp from '@hooks/useApp'
import Alert from '@mui/material/Alert'
import Slide from '@mui/material/Slide'
import Snackbar from '@mui/material/Snackbar'

export default function Notification() {
  const { appNotification, notification } = useApp()

  function handleCloseSnackbar() {
    appNotification({ open: false })
  }

  return (
    <Snackbar
      sx={{ width: 'fit-content', ml: 'auto' }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={notification?.open}
      autoHideDuration={3000}
      resumeHideDuration={1000}
      onClose={(ev, reason) => {
        // callback passed when called appNotification({ onClose })
        notification?.onClose?.()

        handleCloseSnackbar()
      }}
      slots={{ transition: Slide }}
      slotProps={{ transition: { in: notification?.open } }}>
      <Alert
        icon={notification?.icon}
        onClose={handleCloseSnackbar}
        severity={notification?.status}
        action={notification?.action}>
        {notification?.message}
      </Alert>
    </Snackbar>
  )
}
