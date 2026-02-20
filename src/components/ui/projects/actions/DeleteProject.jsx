import Dialog from '@components/reusable/dialogs/Dialog'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Delete from '@mui/icons-material/Delete'
import MenuAction from '@components/reusable/MenuAction'
import Button from '@mui/material/Button'

import { useState, useRef } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import useLoadResources from '@hooks/useLoadResources'

import projectService from '@services/project'
import gsap from 'gsap'

export default function DeleteProject({ id, owner, asButton, disabled, onDelete }) {
  const { uid, update, metadata } = useUser()
  const { t } = useTranslation(['dialogs', 'ui', 'projects'])
  const { appNotification } = useApp()

  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState({
    stage: '',
    count: 0,
    totalTasks: 0,
    totalSubtasks: 0
  })

  const container = useRef(null)
  const textRef = useRef(null)
  const loadingResources = useLoadResources('dialogs')
  const { contextSafe } = useGSAP({ scope: container })

  const animateStatusChange = contextSafe(async (newStatus) => {
    const tl = gsap.timeline()
      .to(textRef.current, { y: -10, opacity: 0, duration: 0.3 })
      .call(() => setStatus(newStatus))
      .fromTo(textRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 }
      )
    await tl
  })

  const handleProjectRemoval = async () => {
    try {
      const results = await projectService.removeProject(uid, id, animateStatusChange)

      appNotification({
        message: t('alerts.projects.projectDeleted', {
          tasks: results.totalTasks,
          subtasks: results.totalSubtasks,
          ns: 'ui'
        })
      })

      setOpen(false)

      if (id === metadata.lastEditedProject && owner === metadata.lastEditedProjectOwner) {
        await update({ lastEditedProject: '', lastEditedProjectOwner: '' })
      }

      onDelete?.()
    } catch (err) {
      appNotification({
        message: t('alerts.projects.errorDeleting', { ns: 'ui' }),
        status: 'error'
      })
      animateStatusChange({ stage: '', count: 0, totalTasks: 0, totalSubtasks: 0 })
    }
  }

  const getStatusMessage = () => {
    const { stage, count, totalTasks, totalSubtasks } = status
    if (stage === 'tasks') return t('projects.status.tasks', { ns: 'dialogs' })
    if (stage === 'subtasks') return t('projects.status.subtasks', { ns: 'dialogs', count })

    if (stage === 'deleting') return t('projects.deleting', {
      ns: 'dialogs',
      count: totalTasks + totalSubtasks
    })

    if (stage === 'project') return t('projects.status.project', { ns: 'dialogs' })
    return t('projects.status.idle', { ns: 'dialogs' })
  }

  return (
    <Box ref={container}>
      {asButton ? (
        <Button
          startIcon={<Delete fontSize='small' />}
          color='error'
          variant='outlined'
          fullWidth
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          {t('deleteProject', { ns: 'projects' })}
        </Button>
      ) : (
        <MenuAction
          handler={() => setOpen(true)}
          text={t('deleteProject', { ns: 'projects' })}
          icon={<Delete color='error' fontSize='small' />}
          disabled={disabled}
          sx={[
            theme => ({
              '& .MuiListItemText-root': { color: theme.palette.error.light }
            })
          ]}
        />
      )}

      {open && (
        <Dialog
          title='projects.delete'
          titleLoaded={!loadingResources}
          onClose={() => !status.stage && setOpen(false)}
          onAccept={handleProjectRemoval}
          open={open}
          acceptTitle={status.stage ? t('projects.deleting', { ns: 'dialogs' }) : 'Delete'}
          disableButtons={!!status.stage} >
          <Box sx={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography
              ref={textRef}
              variant='body1'
              color='error'
              textAlign='center'
              sx={{ fontWeight: 500 }}>
              {getStatusMessage()}
            </Typography>
          </Box>
        </Dialog>
      )}
    </Box>
  )
}
