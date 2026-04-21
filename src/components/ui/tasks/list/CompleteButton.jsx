import Checkbox from '@mui/material/Checkbox'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import Box from '@mui/material/Box'
import TaskTooltip from '@components/reusable/tasks/Tooltip'

import { useRef, useMemo } from 'preact/hooks'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

import { taskRegistry } from '@stores/task'
import { useTheme } from '@mui/material'

const STATUS_CYCLE = {
  todo: 'done',
  done: 'cancelled',
  cancelled: 'todo'
}

export default function CompleteButton({ id, insideTask }) {
  const { t } = useTranslation('tasks')
  const { actions } = useTasks()
  const { data: projectData } = useProject()
  const isArchived = projectData?.isArchived

  const theme = useTheme()

  const btnRef = useRef(null)
  const actualAnim = useRef(null)

  const taskData = taskRegistry.peek().get(id)?.value
  const status = taskData.status || 'todo'
  const parentId = taskData?.parentId || taskData?.subtask
  const isChecked = status === 'done' || status === 'cancelled'

  const btnIconSize = !insideTask ? 'medium' : 'small'

  const { contextSafe } = useGSAP({ scope: btnRef })

  const animateIn = contextSafe(() => {
    gsap.fromTo(btnRef.current, 
      { scale: 0.4, opacity: 0, rotate: -20 },
      { 
        scale: 1, 
        opacity: 1, 
        rotate: 0, 
        duration: 0.5, 
        ease: 'elastic.out(1.2, 0.5)',
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

    const tl = gsap.timeline({
      onComplete: () => actions.updateStatus({ id, parentId, nextStatus })
    })

    tl.to(btnRef.current, {
      scale: 1.3,
      duration: 0.1,
      ease: 'power2.out'
    })
      .to(btnRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'elastic.out(1, 0.75)'
      })

    actualAnim.current = tl
  })

  if (!taskData) return null

  const checkBoxStyles = useMemo(() => ({
    color: 'text.secondary',
    '&.Mui-checked .MuiSvgIcon-root': {
      border: `2px solid ${theme.palette.grey[800]}`,
      ...theme.applyStyles('dark', {border: `2px solid ${theme.palette.grey[400]}`}),

      borderRadius: 1,
      p: '1px'
    },
    '&:hover': { backgroundColor: 'action.hover' }
  }), [theme.palette.mode])

  return (
    <TaskTooltip
      key={`tt-${id}`}
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
        sx={checkBoxStyles}
        checkedIcon={
          <Box display='flex'>
            {status === 'done'
              ? <DoneIcon fontSize={btnIconSize} color='success' />
              : <CloseIcon fontSize={btnIconSize} color='error' />
            }
          </Box>
        }
      />
    </TaskTooltip>
  )
}
