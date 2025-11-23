import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'

import useApp from '@hooks/useApp'
import useUser from '@hooks/useUser'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export default function DeleteAccountButton({ handler }) {
  const { t } = useTranslation('profile')
  const { preferences } = useUser()
  const { appNotification } = useApp()

  const deleteAccount = useCallback(() => {
    appNotification({
      message: "ERROR: Couldn't delete the account."
    })
  }, [appNotification])

  return (
    <Button
      onClick={deleteAccount}
      variant='outlined'
      endIcon={
        <DeleteIcon
          sx={[theme => ({ color: theme.palette.error[preferences.theme] })]}
        />
      }
      color='error'>
      {t('deleteAccount')}
    </Button>
  )
}
