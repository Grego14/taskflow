import Dialog from '@components/reusable/dialogs/Dialog'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Delete from '@mui/icons-material/Delete'
import MenuAction from '@components/reusable/MenuAction'

import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import useLoadResources from '@hooks/useLoadResources'

import projectService from '@services/project'
import gsap from 'gsap'

export default function DeleteProject({ id }) {
  const { uid, update, metadata } = useUser()
  const { t, i18n } = useTranslation(['dialog', 'ui'])
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

      update({ lastEditedProject: '', lastEditedProjectOwner: '' })
    } catch (err) {
      appNotification({
        message: t('alerts.projects.errorDeleting', { ns: 'ui' }),
        status: 'error'
      })
      animateStatusChange({ stage: '', count: 0, totalTasks: 0, totalSubtasks: 0 })
    }
  }

  const getStatusMessage = () => {
    const useDialogT = (trans, count) => t(trans, { ns: 'dialogs', count })

    const { stage, count, totalTasks, totalSubtasks } = status

    if (stage === 'tasks')
      return useDialogT('projects.status.tasks')

    if (stage === 'subtasks')
      return useDialogT('projects.status.subtasks', count)

    if (stage === 'deleting')
      return useDialogT('projects.status.deleting', totalTasks + totalSubtasks)

    if (stage === 'project') return useDialogT('projects.status.project')

    return useDialogT('projects.status.idle')
  }

  return (
    <Box ref={container}>
      <MenuAction
        handler={() => setOpen(true)}
        text={t('projects.deleteProject', { ns: 'ui' })}
        icon={<Delete color='error' fontSize='small' />}
        sx={[theme => ({
          '& .MuiListItemText-root': {
            color: theme.palette.error.light,
            ...theme.applyStyles('dark', { color: theme.palette.error.dark })
          }
        })]}
      />

      <Dialog
        title='projects.delete'
        titleLoaded={!loadingResources}
        onClose={() => !status.stage && setOpen(false)}
        onAccept={handleProjectRemoval}
        open={open}
        acceptTitle={status.stage ? t('projects.deleting', { ns: 'dialog' }) : 'Delete'}
        disableButtons={!!status.stage}>
        <Box sx={{
          miHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography
            ref={textRef}
            variant='body'
            color='error'
            textAlign='center'
            sx={{ fontWeight: 500 }}>
            {getStatusMessage()}
          </Typography>
        </Box>
      </Dialog>
    </Box>
  )
}
