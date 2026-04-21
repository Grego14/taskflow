import {
  Suspense,
  lazy,
  memo,
  useMemo,
  useLayoutEffect,
  forwardRef
} from 'preact/compat'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

import CompleteButton from './CompleteButton'
import Header from './Header'
import Subtasks from './Subtasks'
const Content = lazy(() => import('./Content'))
const DropIndicator = lazy(() => import('./DropIndicator'))

import useLayout from '@hooks/useLayout'
import { useTheme } from '@mui/material/styles'
import useTaskAnimations from '@hooks/tasks/useTaskAnimations'

import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import { priorityColors } from '@/constants'
import sortTasks from '@utils/tasks/sortTasks'

import { taskRegistry, rootTaskIds, activeDropIndicator } from '@stores/task'

const getTaskData = (id, type, isOverdue) => ({ id, type, isOverdue })

const getCardOpacity = (showIndicator, isOverdue, status, isDefaultFilter) =>
  // show the items with opacity only if the filter is the default
  (showIndicator || isOverdue || status === 'cancelled') && isDefaultFilter
    ? 0.75
    : 1

const getTaskCardStyles = (t, priority) => {
  const [fg] = priorityColors[priority]

  return {
    borderLeftColor: fg,
    backgroundImage: 'unset',
    backgroundColor: t.alpha(t.palette.grey[50], 0.075),
    '&[data-focused]': { boxShadow: `0 0 0 2px ${fg}` },
    maxWidth: t.ui.taskCardMaxWidth
  }
}

const wrapperStyles = {
  opacity: 0,
  visibility: 'hidden',
  marginBottom: 3.5,
  '&:last-child, &.removing': { marginBottom: 0 },
}

const staticCardStyles = {
  borderRadius: '12px',
  border: '1px solid',
  borderColor: 'divider',
  '&:hover': {
    borderColor: 'primary.main',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
  },
  width: '100%',
  mx: 'auto',
  borderLeftWidth: 4,
  transitionProperty: 'opacity, background-color',
  cursor: 'grab',
  willChange: 'transform, opacity'
}

const headerWrapperStyles = { width: '100%', alignItems: 'center', gap: 0.5 }

const ListTask = forwardRef(({ id, isPromoted = false }, ref) => {
  const { filter } = useLayout()
  const theme = useTheme()
  const { animateItemEntrance } = useTaskAnimations()

  const data = taskRegistry.value.get(id) || {}
  const hasData = !!data?.id

  const { status, priority = 'none', subtasks = [] } = data
  const parentId = data?.parentId

  const isOverdue = taskIsOverdue(data)
  const isChecked = status === 'done' || status === 'cancelled'

  const parentData = taskRegistry.value.get(parentId) || {}
  const isParentChecked = parentData?.status === 'done' 
    || parentData?.status === 'cancelled'

  const { sourceId, targetId, edge } = activeDropIndicator.value || {}
  const showIndicator = targetId === id && sourceId !== id
  const indicatorEdge = showIndicator ? edge : null

  const filteredSubtaskIds = useMemo(() => {
    if (!subtasks.length) return []

    const registry = taskRegistry.value
    const validSubtasks = []

    for (const id of subtasks) {
      const subtaskData = registry.get(id)
      if (!subtaskData) continue

      // if parent is overdue, show only overdue subtasks if not, show all
      if (!isOverdue || taskIsOverdue(subtaskData)) 
        validSubtasks.push(subtaskData)
    }

    return sortTasks(validSubtasks).map(t => t.id)
  }, [subtasks, isOverdue])

  useLayoutEffect(() => {
    if (!hasData || !data.createdAt) return

    const createdTime = typeof data.createdAt === 'number' 
      ? data.createdAt 
      : data.createdAt.seconds * 1000

    const isNew = Math.abs(Date.now() - createdTime) < 5000

    if (isNew) animateItemEntrance(id)
  }, [hasData])

  const cardStyles = useMemo(() => {
    if (!hasData) return {}

    const opacity = getCardOpacity(
      showIndicator, 
      isOverdue, 
      status, 
      filter === 'default'
    )

    return {
      opacity,
      ...staticCardStyles,
      ...getTaskCardStyles(theme, priority),
    }
  }, [
      hasData, 
      showIndicator, 
      isOverdue, 
      status, 
      filter, 
      priority, 
      theme.palette.mode
    ])

  if (!data) return null

  return (
    <Box
      className='task relative flex flex-center flex-column'
      sx={wrapperStyles}
      data-task-id={id}
      data-type='task'
      data-parent-id={parentId}
      data-is-overdue={isOverdue}>
      <Suspense fallback={null}>
        {showIndicator && ( <DropIndicator isTop={indicatorEdge === 'top'} />)}
      </Suspense>

      <Card
        className='flex flex-column'
        ref={ref}
        elevation={3}
        sx={cardStyles}>
        <Box
          className='flex flex-column'
          p={1.15}>
          <Box className='flex'
            sx={headerWrapperStyles}>
            <CompleteButton id={id} />
            <Header id={id} />
          </Box>

          <Suspense fallback={null}>
            {(isOverdue || isParentChecked || isPromoted) && <Content id={id} />}
          </Suspense>
        </Box>

        {filteredSubtaskIds.length > 0 && (
          <Subtasks
            subtaskIds={filteredSubtaskIds}
            isParentChecked={isParentChecked}
            isParentOverdue={isOverdue}
          />
        )}
      </Card>
    </Box>
  )
})

export default memo(ListTask)
