import { useState, useEffect, lazy, Suspense } from 'preact/compat'

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
      transition: 'background-color .25s ease-out',
      borderRadius: '4px',
      transform: 'scaleY(0)',
      transformOrigin: 'center',
      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
    }
  }
}

const SubtaskItem = ({ data, list, onContextMenu, isParentOverdue }) => {
  const { isArchived } = useProject()
  const { actions } = useTasks()

  const { isDragging } = useTaskDraggable({
    data,
    isArchived,
    type: 'subtask',
    extraData: { parentId: data.subtask }
  })

  const { isTopVisible, isBottomVisible } = useTaskDropTarget({
    data,
    list,
    type: 'subtask',
    onDrop: (source, target, edge) =>
      actions.handleReorder(source, target.id, edge)
  })

  const status = data?.status
  const isChecked = status === 'done' || status === 'cancelled'

  return (
    <Box className='relative'>
      <DropIndicator visible={isTopVisible} maxWidth='100%' isTop />

      <Card
        ref={data.ref}
        elevation={0}
        onContextMenu={onContextMenu}
        sx={[theme => ({
          ...subtaskStyles(theme, data.priority),
          opacity: isDragging ? 0.4 : (isChecked ? 0.6 : 1),
          cursor: 'grab'
        })]}>
        {data.id}
        <Box className='flex flex-center' width='100%'>
          <CompleteButton id={data.id} subtask={data.subtask} status={status} />
          <Header data={data} menuHandler={onContextMenu} status={status} insideTask />
        </Box>

        <Suspense fallback={null}>
          {!taskIsOverdue(data) && isParentOverdue && (
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

export default function Subtasks({ data, contextMenuHandler, isParentOverdue }) {
  if (!data?.length) return null

  return (
    <Box
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
}
