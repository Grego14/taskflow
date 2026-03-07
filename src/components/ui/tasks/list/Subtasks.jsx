import { useState, useEffect, lazy, Suspense, memo, useRef } from 'preact/compat'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CompleteButton from './CompleteButton'
import Header from './Header'
import DropIndicator from './DropIndicator'

const OverdueContent = lazy(() => import('./OverdueContent'))

import useProject from '@hooks/useProject'
import taskIsOverdue from '@utils/tasks/taskIsOverdue'
import { priorityColors } from '@/constants'

import useTaskDropTarget from './hooks/useTaskDropTarget'
import useTaskDraggable from './hooks/useTaskDraggable'
import useTasks from '@hooks/useTasks'
import useTaskEntranceAnimation from '@hooks/useTaskEntranceAnimation'

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
      backgroundColor: 'action.hover',
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

const SubtaskItem = ({ data, list, onContextMenu, isParentOverdue }) => {
  const { isArchived } = useProject()
  const { actions } = useTasks()

  const { status, id, ref, priority, subtask, isOverdue } = data

  const { isDragging } = useTaskDraggable({
    data,
    isArchived,
    type: 'subtask',
    extraData: { parentId: subtask }
  })

  const { isTopVisible, isBottomVisible } = useTaskDropTarget({
    data,
    list,
    type: 'subtask',
    onDrop: (source, target, edge) =>
      actions.handleReorder(source, target.id, edge)
  })

  const isChecked = status === 'done' || status === 'cancelled'

  return (
    <Box className='relative'>
      <DropIndicator visible={isTopVisible} maxWidth='100%' isTop />

      <Card
        ref={ref}
        elevation={0}
        onContextMenu={(e) => onContextMenu(e, id)}
        sx={[theme => ({
          ...subtaskStyles(theme, priority),
          opacity: isChecked ? 0.6 : 1,
          ...((isDragging || isOverdue) && { opacity: 0.4 }),
          cursor: 'grab'
        })]}>
        <Box className='flex flex-center' width='100%'>
          <CompleteButton id={id} subtask={subtask} status={status} />
          <Header data={data} status={status} insideTask />
        </Box>

        <Suspense fallback={null}>
          {!isOverdue && isParentOverdue && (
            <Box sx={{ pl: 5.2 }}>
              <OverdueContent data={data} insideTask status={status} />
            </Box>
          )}
        </Suspense>
      </Card>
      <DropIndicator visible={isBottomVisible} maxWidth='100%' />
    </Box>
  )
}

export default memo(function Subtasks({ data, contextMenuHandler, isParentOverdue }) {
  const wrapperRef = useRef(null)

  if (!data?.length) return null

  useTaskEntranceAnimation(wrapperRef, data, true)

  return (
    <Box
      ref={wrapperRef}
      className='flex flex-column relative'
      pb={1}
      sx={{ ml: 4, mb: 1 }}>
      {data.map(subtask => (
        <SubtaskItem
          key={subtask.id}
          data={subtask}
          onContextMenu={contextMenuHandler}
          isParentOverdue={isParentOverdue}
          list={data}
        />
      ))}
    </Box>
  )
})
