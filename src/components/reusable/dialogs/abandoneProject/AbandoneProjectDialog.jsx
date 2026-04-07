import Dialog from '@components/reusable/dialogs/Dialog'

import useLoadResources from '@hooks/useLoadResources'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import { setGlobalAlert } from '@stores/ui'

export default function AbandoneProjectDialog({
  open,
  onClose,
  projectId,
  projectOwner
}) {
  const { t } = useTranslation('ui')
  const { uid } = useUser()
  const loadingResources = useLoadResources('dialogs')

  async function handleProjectQuit() {
    const { default: abandoneProject } =  await import('@services/abandoneProject')
    await abandoneProject(uid, projectId, projectOwner)

    setGlobalAlert({ message: t('notifications.projectAbandoned') })
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
