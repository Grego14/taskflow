import Dialog from '@components/reusable/dialogs/Dialog'

import useApp from '@hooks/useApp'
import useLoadResources from '@hooks/useLoadResources'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import lazyImport from '@utils/lazyImport'

export default function AbandoneProjectDialog({
  open,
  onClose,
  projectId,
  projectOwner
}) {
  const { t } = useTranslation('ui')
  const { uid } = useUser()
  const { appNotification } = useApp()
  const loadingResources = useLoadResources('dialogs')

  async function handleProjectQuit() {
    const abandoneProject = await lazyImport('/src/services/abandoneProject')
    await abandoneProject(uid, projectId, projectOwner)

    appNotification({ message: t('notifications.projectAbandoned') })
    onClose()
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
