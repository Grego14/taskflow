import Button from '@mui/material/Button'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import { getFriendlyAuthError } from '@utils/getFriendlyAuthError'
import useUser from '@hooks/useUser'

export default function SaveProject({
  name,
  description,
  errors,
  isOwner,
  isArchived,
  disableBtn,
  setDisableBtn
}) {
  const { preferences } = useUser()
  const { t } = useTranslation('projects')
  const { data, update } = useProject()
  const { appBarHeight, appNotification } = useApp()

  const hasChanges = name !== data?.name || description !== data?.description
  const hasErrors = errors?.name || errors?.description

  // logic simplified for readability
  const isButtonDisabled = disableBtn || !hasChanges || isArchived || hasErrors

  const updateNewValues = async () => {
    if (isButtonDisabled || !isOwner) return

    try {
      const result = await update({ name, description })

      if (result?.error) throw new Error(result.message)

      setDisableBtn(true)

      appNotification({
        message: t('notifications.savedProject'),
        status: 'success'
      })
    } catch (err) {
      console.error('SaveProject Error:', err.message)
      appNotification({
        message: getFriendlyAuthError(err.message, preferences?.lang),
        status: 'error'
      })
    }
  }

  return (
    <Button
      sx={{
        mx: 'auto',
        borderRadius: 2,
        mb: `calc(${appBarHeight} * 1.2)`
      }}
      variant='contained'
      disabled={isButtonDisabled}
      onClick={updateNewValues}
    >
      {t('settings.saveProject')}
    </Button>
  )
}
