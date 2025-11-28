// components
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MUIDialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Slide from '@mui/material/Slide'
import Typography from '@mui/material/Typography'

// hooks
import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources.js'
import { useTheme } from '@mui/material/styles'
import { forwardRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function Dialog({
  children,
  open,
  onClose,
  onAccept,
  title,
  titleLoaded = false,
  subTitle,
  disableAcceptBtn,
  removeActions,
  maxWidth = 'mobile',
  color = 'textPrimary',
  acceptTitle
}) {
  const { t } = useTranslation(['common', 'dialogs'])
  const { isMobile } = useApp()
  const theme = useTheme()
  const loadingResources = useLoadResources(['common', 'dialogs'])

  if (loadingResources) return null

  return (
    <MUIDialog
      open={open}
      onClose={onClose}
      disableRestoreFocus
      disablePortal
      maxWidth={maxWidth}
      slotProps={{
        transition: { in: open },
        // avoid horizontal scroll on 320px screens
        paper: {
          sx: {
            minWidth: maxWidth === 'mobile' ? '17.5rem' : '25rem'
          }
        }
      }}>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          {titleLoaded || !loadingResources ? (
            <Typography variant='h5' color={color}>
              {t(title, { ns: 'dialogs' })}
            </Typography>
          ) : (
            <Skeleton
              variant='text'
              animation='wave'
              width='75%'
              sx={{ fontSize: theme.typography.h6 }}
            />
          )}

          {children && (
            <IconButton
              edge='end'
              color='inherit'
              onClick={onClose}
              aria-label={t('close_x', {
                ns: 'common',
                x: t('dialog', { ns: 'dialogs' })
              })}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {subTitle && (
          <Typography color='error' marginTop={2}>
            {t(subTitle, { ns: 'dialogs' })}
          </Typography>
        )}
      </DialogTitle>

      {/* allow us to create just a "close or accept" dialog */}
      {children && (
        <>
          <Divider />
          <DialogContent sx={{ px: isMobile ? 2 : 3 }}>
            {children}
          </DialogContent>
          <Divider />
        </>
      )}

      {!removeActions && (
        <DialogActions>
          <Button onClick={onClose} color='primary'>
            {t('close', { ns: 'common' })}
          </Button>
          <Button
            onClick={onAccept}
            color='primary'
            variant='contained'
            disabled={disableAcceptBtn}>
            {acceptTitle ? acceptTitle : t('accept', { ns: 'common' })}
          </Button>
        </DialogActions>
      )}
    </MUIDialog>
  )
}
