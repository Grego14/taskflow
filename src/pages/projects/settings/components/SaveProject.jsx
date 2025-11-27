import Button from '@mui/material/Button'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'

export default function SaveProject({
  name,
  description,
  errors,
  isOwner,
  isArchived,
  disableBtn,
  setDisableBtn
}) {
  const { t } = useTranslation('ui')
  const { data, update } = useProject()
  const { appBarHeight, appNotification } = useApp()

  const valuesChange = name !== data?.name || description !== data?.description

  const updateNewValues = async () => {
    if (
      !valuesChange ||
      errors.name ||
      errors.description ||
      !isOwner ||
      isArchived
    )
      return

    await update({ name, description })

    setDisableBtn(true)
    appNotification({
      message: t('notifications.savedProject'),
      status: 'success'
    })
  }

  return (
    <Button
      sx={{ mx: 'auto', borderRadius: 2, mb: `calc(${appBarHeight} * 1.2)` }}
      variant='contained'
      disabled={disableBtn || !valuesChange || isArchived}
      onClick={updateNewValues}>
      {t('projects.settings.saveProject')}
    </Button>
  )
}
