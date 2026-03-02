import Checkbox from '@mui/material/Checkbox'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import Box from '@mui/material/Box'

import { useRef } from 'preact/hooks'
import useProject from '@hooks/useProject'
import useTaskActions from '@hooks/useTaskActions'
import useUser from '@hooks/useUser'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const STATUS_CYCLE = {
  todo: 'done',
  done: 'cancelled',
  cancelled: 'todo'
}

export default function CompleteButton({ id, subtask, status }) {
  const { updateStatus } = useTaskActions()
  const { preferences } = useUser()
  const { isArchived } = useProject()
  const iconRef = useRef(null)

  useGSAP(() => {
    if (!status || status === 'todo' || !iconRef.current) return

    gsap.fromTo(iconRef.current,
      { scale: 0.4, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
        overwrite: 'all'
      }
    )
  }, [status])

  const handleStatusChange = e => {
    e.stopPropagation()

    const nextStatus = STATUS_CYCLE[status] || 'todo'
    updateStatus({ id, subtask, checked: e.target.checked }, nextStatus)
  }

  const isChecked = status === 'done' || status === 'cancelled'
  const isDark = preferences.theme === 'dark'

  return (
    <Checkbox
      onClick={handleStatusChange}
      size={subtask ? 'small' : 'medium'}
      disableRipple
      checked={isChecked}
      disabled={isArchived}
      sx={{
        color: 'text.secondary',
        '&.Mui-checked .MuiSvgIcon-root': {
          border: theme => `2px solid ${isDark ? theme.palette.grey[400] : theme.palette.grey[800]}`,
          borderRadius: 1,
          p: '1px'
        },
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
      checkedIcon={
        <Box ref={iconRef} display='flex'>
          {status === 'done'
            ? <DoneIcon fontSize='medium' color='success' />
            : <CloseIcon fontSize='medium' color='error' />
          }
        </Box>
      }
    />
  )
}
