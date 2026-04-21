import Checkbox from '@mui/material/Checkbox'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import Box from '@mui/material/Box'
import TaskTooltip from '@components/reusable/tasks/Tooltip'

import { useRef } from 'preact/hooks'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

import { taskRegistry } from '@stores/task'

const STATUS_CYCLE = {
  todo: 'done',
  done: 'cancelled',
  cancelled: 'todo'
}

export default function CompleteButton({ id }) {
  const { t } = useTranslation('tasks')
  const { actions } = useTasks()
  const { preferences } = useUser()
  const { data: projectData } = useProject()

  const btnRef = useRef(null)
  const actualAnim = useRef(null)

  const taskData = taskRegistry.value.get(id)
  const status = taskData?.status || 'todo'
  const parentId = taskData?.parentId || taskData?.subtask

  const isArchived = projectData?.isArchived
  const isDark = preferences.theme === 'dark'
  const isChecked = status === 'done' || status === 'cancelled'

  const { contextSafe } = useGSAP({ scope: btnRef })

  const animateIn = contextSafe(() => {
    actualAnim.current = gsap.fromTo(btnRef.current,
      { scale: 0.7, opacity: 0, rotate: -15 },
      {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 0.3,
        ease: 'back.out(2)',
        clearProps: 'all'
      }
    )
  })

  // enter animation of the btn when the status change
  useGSAP(() => animateIn(), [status])

  const handleStatusChange = contextSafe(e => {
    const isKeyEvent = e.type === 'keydown'
    const isEnterKey = e.key === 'Enter'

    if (isKeyEvent && !isEnterKey || isArchived) return

    e.stopPropagation()

    const nextStatus = STATUS_CYCLE[status] || 'todo'

    if(actualAnim.current?.isActive?.()) return

    actualAnim.current = gsap.to(btnRef.current, {
      scale: 0.5,
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        actions.updateStatus({ id, parentId, nextStatus })
      }
    })
  })

  if (!taskData) return null

  return (
    <TaskTooltip
      title={t('buttons.complete_newStatus', {
        newStatus: STATUS_CYCLE[status]
      })}>
      <Checkbox
        ref={btnRef}
        onClick={handleStatusChange}
        onKeyDown={handleStatusChange}
        size={parentId ? 'small' : 'medium'}
        disableRipple
        checked={isChecked}
        disabled={isArchived}
        sx={{
          color: 'text.secondary',
          '&.Mui-checked .MuiSvgIcon-root': {
            border: theme => `2px solid ${isDark
              ? theme.palette.grey[400]
              : theme.palette.grey[800]}`,
            borderRadius: 1,
            p: '1px'
          },
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
        checkedIcon={
          <Box display='flex'>
            {status === 'done'
              ? <DoneIcon fontSize='medium' color='success' />
              : <CloseIcon fontSize='medium' color='error' />
            }
          </Box>
        }
      />
    </TaskTooltip>
  )
}
