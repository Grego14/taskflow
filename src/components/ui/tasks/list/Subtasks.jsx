import {
  lazy,
  Suspense,
  memo,
  useRef,
  forwardRef,
  useLayoutEffect
} from 'preact/compat'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CompleteButton from './CompleteButton'
import Header from './Header'
import DropIndicator from './DropIndicator'

import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import { priorityColors } from '@/constants'

import useTasks from '@hooks/useTasks'
import useLayout from '@hooks/useLayout'
import useTaskAnimations from '@hooks/tasks/useTaskAnimations'

import { taskRegistry, activeDropIndicator } from '@stores/task'

const subtaskStyles = (theme, priority) => {
  const priorityColor = priorityColors[priority][0]

  return {
    width: '100%',
    p: 1,
    pr: 2,
    backgroundColor: 'transparent',
    borderRadius: 0,
    overflow: 'visible',
    position: 'relative',
    transition: 'opacity 0.3s ease-out',
    '&:hover': {
      '&::after': {
        opacity: 1,
        transform: 'translateY(-50%) scale(1)' // bullet pop effect
      },
      '&::before': {
        opacity: 1,
        transform: 'scaleY(1)'
      }
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      left: -16,
      top: '50%',
      transform: 'translateY(-50%) scale(0.3)',
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: priorityColor,
      opacity: 0,
      transition:
        'opacity 0.3s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      pointerEvents: 'none'
    },
    '&:hover::before': { backgroundColor: priorityColor },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '2px',
      backgroundColor: 'transparent',
      borderRadius: '4px',
      transform: 'scaleY(0)',
      transformOrigin: 'center',
      transition:
        'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, background-color 0.3s ease'
    }
  }
}

const SubtaskItem = forwardRef(function SubtaskItem(props, ref) {
  const { 
    id, 
    isParentChecked, 
    isParentOverdue, 
    listIds
  } = props

  const { animateItemEntrance } = useTaskAnimations()

  const data = taskRegistry.peek().get(id)?.value || {}
  const hasData = !!data?.id

  const status = data?.status
  const priority = data?.priority || 'none'
  const parentId = data?.parentId
  const isOverdue = hasData ? taskIsOverdue(data) : false
  const isChecked = status === 'done' || status === 'cancelled'

  const { sourceId, targetId, edge } = activeDropIndicator.value || {}
  const showIndicator = targetId === id && sourceId !== id
  const indicatorEdge = showIndicator ? edge : null

  useLayoutEffect(() => {
    if (!hasData || !data.createdAt) return

    const createdTime = typeof data.createdAt === 'number' 
      ? data.createdAt 
      : data.createdAt.seconds * 1000

    const isNew = Math.abs(Date.now() - createdTime) < 5000

    if (isNew) animateItemEntrance(id)
  }, [hasData])

  if (!hasData) return null

  return (
    <Box className='relative'
      data-task-id={id}
      data-type='subtask'
      data-parent-id={parentId}
      data-is-overdue={isOverdue}>
      <Suspense fallback={null}>
        {showIndicator && (
          <DropIndicator 
            maxWidth='100%' 
            isTop={indicatorEdge === 'top'} 
            isSubtask
          />
        )}
      </Suspense>

      <Card
        ref={ref}
        elevation={0}
        sx={[theme => ({
          ...subtaskStyles(theme, priority),
          opacity: isChecked ? 0.6 : 1,
          ...(showIndicator || (isOverdue && !isParentOverdue) && { opacity: 0.4 }),
          cursor: 'grab'
        })]}>
        <Box className='flex flex-center' width='100%'>
          <CompleteButton id={id} insideTask />
          <Header id={id} insideTask />
        </Box>
      </Card>
    </Box>
  )
})

export default memo(function Subtasks(props) {
  const {
    subtaskIds = [], 
    isParentOverdue, 
    isParentChecked 
  } = props

  const wrapperRef = useRef(null)
  const { setTaskRef } = useTasks()
  const { filter } = useLayout()
  const { animateEntrance } = useTaskAnimations()

  useLayoutEffect(() => {
    if (subtaskIds.length > 0) 
      animateEntrance(wrapperRef, subtaskIds, { subtasks: true })
  }, [filter, subtaskIds.length])

  if (!subtaskIds.length) return null

  return (
    <Box
      ref={wrapperRef}
      className='flex flex-column relative'
      sx={{ ml: 4, pb: 1 }}>
      {subtaskIds.map(id => (
        <SubtaskItem
          key={id}
          id={id}
          listIds={subtaskIds}
          isParentChecked={isParentChecked}
          isParentOverdue={isParentOverdue}
          ref={el => setTaskRef(id, el)}
        />
      ))}
    </Box>
  )
})
