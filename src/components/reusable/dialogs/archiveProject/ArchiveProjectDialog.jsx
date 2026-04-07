import Dialog from '@components/reusable/dialogs/Dialog'

import useAuth from '@hooks/useAuth'
import useLoadResources from '@hooks/useLoadResources'
import { useTranslation } from 'react-i18next'

import { setGlobalAlert } from '@stores/ui'

export default function ArchiveProjectDialog({ open, onClose, projectId }) {
  const { t } = useTranslation('ui')
  const { currentUser } = useAuth()
  const loadingResources = useLoadResources('dialogs')

  async function handleProjectRemoval() {
    const { default: archiveProject } = await import('@services/archiveProject')
    await archiveProject({ user: currentUser?.uid, project: projectId })

    setGlobalAlert({ message: t('notifications.projectArchived') })
    onClose()
  }

  return (
    <Dialog
      title='projects.archive'
      subTitle='projects.archive2'
      titleLoaded={!loadingResources}
      removeActonsDivider
      onAccept={handleProjectRemoval}
      open={open}
      onClose={onClose}
    />
  )
}
