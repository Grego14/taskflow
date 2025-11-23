import AddMembersDialog from '@components/reusable/dialogs/addMembers/AddMembersDialog'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import useProject from '@hooks/useProject'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

export default function AddMembers() {
  const { t } = useTranslation('ui')
  const [open, setOpen] = useState(false)
  const { projectId } = useParams()
  const { data } = useProject()

  return (
    <>
      <Tooltip title={t('buttons.addMembers')}>
        <span>
          <IconButton onClick={() => setOpen(true)} disabled={data?.isArchived}>
            <PersonAddIcon fontSize='medium' />
          </IconButton>
        </span>
      </Tooltip>

      {open && <AddMembersDialog open={open} setOpen={setOpen} />}
    </>
  )
}
