import Dialog from '@components/reusable/dialogs/Dialog'

import useAuth from '@hooks/useAuth'
import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'
import { useTranslation } from 'react-i18next'

import lazyImport from '@utils/lazyImport'

export default function ArchiveProjectDialog({ open, onClose, projectId }) {
  const { t } = useTranslation('ui')
  const { currentUser } = useAuth()
  const { appNotification } = useApp()
  const loadingResources = useLoadResources('dialogs')

  async function handleProjectRemoval() {
    const archiveProject = await lazyImport('/src/services/archiveProject')
    await archiveProject({ user: currentUser?.uid, project: projectId })

    appNotification({ message: t('notifications.projectArchived') })
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
