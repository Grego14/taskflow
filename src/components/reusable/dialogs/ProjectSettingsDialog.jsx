import { useAppState } from '@/context/AppContext'
import useTranslations from '@hooks/useTranslations'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import { useState } from 'react'
import './ProjectSettingsDialog.css'

export default function ProjectSettingsDialog({ open, setOpen }) {
  const t = useTranslations()

  const { user, actualProjectData: project } = useAppState()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.75)' }
      }}>
      <DialogTitle>{t.dialogs.projectSettings.title}</DialogTitle>

      <DialogContent className='project-settings-dialog__content'>
        {project && (
          <>
            <div className='project-settings-dialog__input-group'>
              <label
                htmlFor='project-name'
                className='project-settings-dialog__label'>
                {t.dialogs.projectSettings.labels.name}
              </label>
              <input
                className='project-settings-dialog__input'
                type='text'
                name='project-name'
                id='project-name'
                defaultValue={project.name}
              />
            </div>
            <div className='project-settings-dialog__input-group'>
              <label
                htmlFor='project-desc'
                className='project-settings-dialog__label'>
                {t.dialogs.projectSettings.labels.description}
              </label>
              <textarea
                className='project-settings-dialog__textarea'
                name='project-desc'
                id='project-desc'
                cols='30'
                rows='10'
                defaultValue={project.description}
              />
            </div>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>{t.common.close}</Button>
        <Button onClick={handleClose} variant='contained'>
          {t.common.accept}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
