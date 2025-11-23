import Checkbox from '@mui/material/Checkbox'

import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'

import useProject from '@hooks/useProject'
import useTaskActions from '@hooks/useTaskActions'
import useUser from '@hooks/useUser'
import { useEffect, useState } from 'react'

export default function CompleteButton({ id, setStatus, status }) {
  const { updateStatus } = useTaskActions()
  const { preferences } = useUser()
  const { isArchived } = useProject()

  const handleStatusChange = e => {
    const nextStatus = (() => {
      if (status === 'done') return 'cancelled'
      if (status === 'cancelled') return 'todo'
      if (status === 'todo') return 'done'
    })()

    updateStatus(e, nextStatus)
    setStatus(nextStatus)
  }

  const isChecked = status === 'done' || status === 'cancelled'

  return (
    <Checkbox
      onClick={handleStatusChange}
      size='medium'
      disableRipple
      checked={isChecked}
      sx={[
        theme => ({
          mb: 'auto',
          ...(isChecked && {
            '& .MuiSvgIcon-root': {
              border: `2px solid ${theme.palette.grey[preferences.theme === 'dark' ? 400 : 800]}`,
              borderRadius: 1
            }
          })
        })
      ]}
      disabled={isArchived}
      checkedIcon={
        status === 'done' ? (
          <DoneIcon fontSize='medium' />
        ) : (
          <CloseIcon fontSize='medium' />
        )
      }
    />
  )
}
