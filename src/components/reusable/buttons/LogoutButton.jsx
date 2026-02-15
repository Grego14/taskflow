import LogoutIcon from '@mui/icons-material/Logout'
import Button from '@mui/material/Button'

import { logOut } from '@/firebase/auth.js'
import { setItem } from '@utils/storage.js'
import { useTranslation } from 'react-i18next'

export default function LogoutButton({ handler, variant = 'outlined' }) {
  const { t } = useTranslation('common')

  return (
    <Button
      onClick={async () => {
        await logOut()

        location.assign('/')
        setItem('drawerOpen', false)
      }}
      variant={variant}
      endIcon={<LogoutIcon />}>
      {t('logout')}
    </Button>
  )
}
