import useTranslations from '@hooks/useTranslations'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MUIDialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'

export default function Dialog({ children, open, onClose, onAccept, title }) {
  const t = useTranslations()

  return (
    <MUIDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='mobile'
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.75)' }
      }}>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <Typography variant='h6'>{title}</Typography>

          <IconButton
            edge='end'
            color='inherit'
            onClick={onClose}
            aria-label='close dialog'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />
      <DialogContent>{children}</DialogContent>
      <Divider />

      <DialogActions>
        <Button onClick={onClose} color='primary'>
          {t.common.close}
        </Button>
        <Button onClick={onAccept} color='primary' variant='contained'>
          {t.common.accept}
        </Button>
      </DialogActions>
    </MUIDialog>
  )
}
