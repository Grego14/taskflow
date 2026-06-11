import MenuAction from '@components/reusable/MenuAction'
import AbandonProjectDialog from './AbandonProjectDialog'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import Button from '@mui/material/Button'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AbandonProject({ id, owner, asButton, disabled }) {
  const { t } = useTranslation('projects')
  const [open, setOpen] = useState(false)

  return (
    <>
      {asButton ? (
        <Button
          startIcon={<ExitToAppIcon fontSize='small' />}
          color='info'
          variant='outlined'
          onClick={() => setOpen(true)}
          disabled={disabled}
          className='project-action'>
          {t('abandoneProject')}
        </Button>
      ) : (
        <MenuAction
          handler={() => setOpen(true)}
          text={t('abandoneProject')}
          icon={<ExitToAppIcon fontSize='small' color='info' />}
          className='abandon-menu-action'
        />
      )}

      {open && (
        <AbandonProjectDialog
          open={open}
          onClose={() => setOpen(false)}
          projectId={id}
          projectOwner={owner}
        />
      )}
    </>
  )
}
