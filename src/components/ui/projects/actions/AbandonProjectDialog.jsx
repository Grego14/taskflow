import Dialog from '@components/reusable/dialogs/Dialog'
import Box from '@mui/material/Box'

import { useRef } from 'react'
import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import projectService from '@services/project'

export default function AbandonProjectDialog({ open, onClose, projectId, projectOwner }) {
  const { t } = useTranslation(['dialogs', 'ui'])
  const { uid } = useUser()
  const { appNotification } = useApp()
  const loadingResources = useLoadResources('dialogs')
  const navigate = useNavigate()

  async function handleProjectQuit() {
    try {
      await projectService.abandonProject(uid, projectId, projectOwner)

      appNotification({
        message: t('notifications.projectAbandoned', { ns: 'ui' }),
        status: 'success'
      })

      onClose()
      navigate('/projects')
    } catch (err) {
      appNotification({
        message: err.message,
        status: 'error'
      })
    }
  }

  return (
    <Dialog
      title='projects.abandone'
      subTitle='projects.abandone2'
      titleLoaded={!loadingResources}
      removeActonsDivider
      onAccept={handleProjectQuit}
      open={open}
      onClose={onClose}
    />
  )
}
