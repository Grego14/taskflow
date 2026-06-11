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

  const [priorityColor] = priorityColors[priority]

  const dynamicStyles = {
    '--task-priority-color': priorityColor,
    opacity: isChecked 
      ? 0.6 
      : (showIndicator || (isOverdue && !isParentOverdue) ? 0.4 : 1)
  }

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
        className='task-card subtask-item relative'
        ref={ref}
        elevation={0}
        style={dynamicStyles}>
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
      className='flex flex-column relative subtasks-container'>
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
