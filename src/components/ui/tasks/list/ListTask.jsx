import {
  Suspense,
  lazy,
  memo,
  useRef,
  useMemo,
  forwardRef,
  useEffect
} from 'preact/compat'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CompleteButton from './CompleteButton'
import Header from './Header'
import DropIndicator from './DropIndicator'
import Subtasks from './Subtasks'

const TaskContextMenu = lazy(() => import('./TaskContextMenu'))
const Content = lazy(() => import('./Content'))

import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import useLayout from '@hooks/useLayout'

import useContextMenu from './hooks/useContextMenu'
import useTaskDropTarget from './hooks/useTaskDropTarget'
import useTaskDraggable from './hooks/useTaskDraggable'
import useTaskAnimations from '@hooks/tasks/useTaskAnimations'

import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import { priorityColors } from '@/constants'
import sortTasks from '@utils/tasks/sortTasks'

const getCardOpacity = (isDragging, isOverdue, status, isDefaultFilter) =>
  // show the items with opacity only if the filter is the default
  (isDragging || isOverdue || status === 'cancelled') && isDefaultFilter
    ? 0.75
    : 1

const getTaskCardStyles = (t, priority, isDragging, isOverdue, status, fg, filter) => ({
  borderRadius: '12px',
  border: '1px solid',
  borderColor: 'divider',
  '&:hover': {
    borderColor: 'primary.main',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
  },
  width: '100%',
  maxWidth: '30rem',
  mx: 'auto',
  borderLeftWidth: 4,
  borderLeftColor: fg,
  transitionProperty: 'opacity, background-color, border-color, box-shadow',
  backgroundColor: t.alpha(t.palette.background.paper, 0.35),
  cursor: 'grab',
  opacity: getCardOpacity(isDragging, isOverdue, status, filter === 'default'),
  '&[data-focused]': { boxShadow: `0 0 0 2px ${fg}` },
  willChange: 'transform, opacity'
})

const ListTask = forwardRef(({ data }, ref) => {
  const { isArchived } = useProject()
  const { tasks, actions } = useTasks()
  const { filter } = useLayout()

  const {
    isOverdue,
    priority = 'none',
    status,
    subtasks,
    createdAt,
    id,
    isNew,
    isParentChecked,
    isParentOverdue
  } = data

  const { isDragging } = useTaskDraggable({
    data: { ...data, ref },
    isArchived,
    type: 'task',
    extraData: { isOverdue }
  })

  const { isTopVisible, isBottomVisible } = useTaskDropTarget({
    data: { ...data, ref },
    list: tasks,
    type: 'task',
    filter,
    onDrop: (source, target, edge) =>
      actions.handleReorder(source, target.id, edge)
  })

  const [contextMenu, handler] = useContextMenu(isArchived, tasks)
  const [fg] = priorityColors[priority]

  // memoize subtasks to avoid re-filtering on every render
  const filteredSubtasks = useMemo(() => {
    if (!subtasks?.length) return []

    return sortTasks(subtasks.filter(s => isOverdue
      ? taskIsOverdue(s)
      : true))
  }, [subtasks, isOverdue])

  const { animateItemEntrance } = useTaskAnimations()

  useEffect(() => {
    if (isNew) animateItemEntrance(id)
  }, [id, isNew])

  if (!data) return null

  return (
    <Box
      className='task relative flex flex-center flex-column'
      sx={{
        // the TaskWrapper is going to animate the card so we avoid the flash of
        // the dropIndicators
        opacity: 0,
        visibility: 'hidden',
        marginBottom: 3.5,
        '&:last-child, &.removing': { marginBottom: 0 },
      }}>
      <DropIndicator visible={isTopVisible} maxWidth='25rem' isTop />

      <Card
        className='flex flex-column'
        ref={ref}
        elevation={3}
        sx={t => getTaskCardStyles(
          t,
          priority,
          isDragging,
          isOverdue,
          status,
          fg,
          filter
        )}>
        <Box
          className='flex flex-column'
          onContextMenu={(e) => handler(e, id)}
          sx={{ p: 2, py: 1.5 }}>
          <Box className='flex'
            sx={{
              width: '100%',
              alignItems: 'center',
              gap: 1
            }}>
            <CompleteButton id={id} status={status} />
            <Header data={data} status={status} />
          </Box>

          <Suspense fallback={null}>
            {(isParentOverdue || isParentChecked) &&
              <Content data={data} status={status} />
            }
          </Suspense>
        </Box>

        {filteredSubtasks.length > 0 && (
          <Subtasks data={filteredSubtasks} contextMenuHandler={handler} />
        )}
      </Card>

      <DropIndicator visible={isBottomVisible} maxWidth='25rem' />

      {!!contextMenu && (
        <Suspense fallback={null}>
          <TaskContextMenu
            open={!!contextMenu}
            setOpen={handler}
            data={contextMenu}
          />
        </Suspense>
      )}
    </Box>
  )
})

export default memo(ListTask)
