import { Suspense, lazy, memo, useEffect, useRef, useMemo } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CompleteButton from './CompleteButton'
import Header from './Header'
import DropIndicator from './DropIndicator'
import Subtasks from './Subtasks'

const TaskContextMenu = lazy(() => import('./TaskContextMenu'))
const OverdueContent = lazy(() => import('./OverdueContent'))

import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import useLayout from '@hooks/useLayout'
import { useGSAP } from '@gsap/react'

import useContextMenu from './hooks/useContextMenu'
import useTaskDropTarget from './hooks/useTaskDropTarget'
import useTaskDraggable from './hooks/useTaskDraggable'

import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import formatTimestamp from '@utils/formatTimestamp'
import { priorityColors } from '@/constants'
import sortTasks from '@utils/tasks/sortTasks'
import taskIsPending from '@utils/tasks/taskIsPending'
import gsap from 'gsap'

const taskStyles = (t, priority) => ({
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
  transitionProperty: 'opacity, background-color, border-color, box-shadow',
  backgroundColor: t.alpha(t.palette.background.paper, 0.35),
  cursor: 'grab',
  // the user clicks the task link on a non-overdue subtask and sets the
  // focused dataset
  '&[data-focused]': { boxShadow: `0 0 0 2px ${t.palette.primary.main}` }
})

export default memo(function ListTask({ data }) {
  const { isArchived } = useProject()
  const { tasks, actions } = useTasks()
  const { filter } = useLayout()

  const {
    isOverdue,
    priority = 'none',
    status,
    subtasks,
    createdAt,
    ref,
    id
  } = data

  const internalRef = useRef(null)
  const element = ref || internalRef

  const { isDragging } = useTaskDraggable({
    data: { ...data, ref: element },
    isArchived,
    type: 'task',
    extraData: { isOverdue }
  })

  const { isTopVisible, isBottomVisible } = useTaskDropTarget({
    data: { ...data, ref: element },
    list: tasks,
    type: 'task',
    onDrop: (source, target, edge) =>
      actions.handleReorder(source, target.id, edge)
  })

  const [contextMenu, handler] = useContextMenu(isArchived, tasks)
  const [fg, bg] = priorityColors[priority]

  // memoize subtasks to avoid re-filtering on every render
  const filteredSubtasks = useMemo(() => {
    if (!subtasks?.length) return []

    return sortTasks(subtasks.filter(s =>
      isOverdue
        ? taskIsOverdue(s)
        : true))
  }, [subtasks, isOverdue])

  const taskDate = createdAt?.seconds
    ? formatTimestamp(createdAt).raw
    : new Date()
  const diff = new Date() - taskDate
  const isNewTask = diff < 10000

  // new task animation
  useGSAP(() => {
    const element = ref || internalRef
    const cardContainer = element?.current?.parentElement

    if (!cardContainer || !isNewTask) return

    gsap.fromTo(cardContainer, {
      autoAlpha: 0,
      y: -10,
      x: -25,
      ease: 'power2.out'
    }, {
      autoAlpha: 1,
      y: 0,
      x: 0
    })
  })

  if (!data) return null

  const isOverdueLabelVisible = filter !== 'default' &&
    taskIsPending(status) &&
    taskIsOverdue(data)

  return (
    <Box
      className='task relative flex flex-center flex-column'
      sx={{
        // the TaskWrapper is going to animate the card so we avoid the flash of
        // the dropIndicators
        opacity: 0,
        visibility: 'hidden',

        transition: 'margin-bottom 0.3s ease-in 0.3s',
        marginBottom: 3.5,
        '&:last-child, &.removing': { marginBottom: 0 },
      }}>
      <DropIndicator visible={isTopVisible} maxWidth='25rem' isTop />

      <Card
        className='flex flex-column'
        ref={ref || internalRef}
        elevation={3}
        sx={[theme => ({
          ...taskStyles(theme, priority),
          borderLeftColor: fg,
          ...((isDragging || isOverdue) && { opacity: 0.75 }),
          ...(status === 'cancelled' && { opacity: 0.75 })
        })]}>
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
            {isOverdue &&
              <OverdueContent
                data={data}
                status={status}
                isOverdueLabelVisible={isOverdueLabelVisible}
              />
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
