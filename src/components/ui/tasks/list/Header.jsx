import { useMemo, useState, Suspense, lazy, useEffect } from 'preact/compat'

import DropdownMenu from '@components/reusable/DropdownMenu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import UpdatableTaskTitle from './UpdatableTaskTitle'
import TaskMembers from './TaskMembers'
import SmartActionLabel from './SmartActionLabel'
import TaskCalendar from './TaskCalendar'
import TaskActionsSkeleton from '../buttons/TaskActionsSkeleton'
import TaskTotalTime from './TaskTotalTime'
import TaskTooltip from '@components/reusable/tasks/Tooltip'

const TaskActions = lazy(() => import('../buttons/TaskActions'))

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'

import formatTimeAgo from '@utils/formatTimeAgo'
import formatTimestamp from '@utils/formatTimestamp'
import getMenuLabel from '@utils/getMenuLabel'
import getDateByKey from '@utils/tasks/getDateByKey'

import { taskRegistry } from '@stores/task'

const headerStyles = { p: 0, width: '100%' }
const headerSlotProps = {
  action: { sx: { my: 'auto', display: 'flex', gap: 1, mr: 0 } }
}

const menuSlotProps = { paper: { className: 'task-menu-paper' } }

export default function Header({ id, insideTask = false }) {
  const { isOnlyMobile } = useApp()
  const { isArchived } = useProject()
  const { actions } = useTasks()

  const [showTitle, setShowTitle] = useState(false)
  const [open, setOpen] = useState(false)

  const taskData = taskRegistry.value.get(id)

  if (!taskData) return null

  const {
    status,
    subtasks: subtaskIds,
    assignedTo: members,
    priority,
    title,
    rawDate: initialDate
  } = taskData
  const parentId = taskData?.parentId

  const isDone = status === 'done'
  const isCancelled = status === 'cancelled'
  const isChecked = isDone || isCancelled

  const handleDateChange = (newDate, triggerExit) => {
    triggerExit()

    setTimeout(() => {
      actions.updateTask({
        id,
        parentId,
        data: { 
          rawDate: newDate, 
          dueDate: getDateByKey(newDate) 
        }
      })
    }, 250)
  }

  const isParentChecked = parentId 
    ? taskRegistry.value.get(parentId)?.status === 'done' 
    : false

  return (
    <CardHeader
      className='flex-center'
      sx={headerStyles}
      disableTypography
      slotProps={headerSlotProps}
      title={
        <UpdatableTaskTitle
          title={title}
          taskId={id}
          isChecked={isChecked}
          isCancelled={isCancelled}
          subtask={parentId}
          show={showTitle}
          setShow={setShowTitle}
        />
      }
      action={
        !showTitle ? (
          <>
            {/* Show the total time on the parent task */}
            {!parentId ? <TaskTotalTime id={id} /> : null}

            {(!isChecked && !isParentChecked) ? (
              <SmartActionLabel id={id} insideTask={insideTask} />
            ): null}

            <TaskMembers
              assignedTo={members}
              subtaskIds={subtaskIds}
              insideTask={insideTask}
            />

            {!isOnlyMobile ? (
              <TaskCalendar
                rawDate={initialDate}
                insideTask={insideTask}
                onDateChange={handleDateChange}
              />
            ): null}

            <DropdownMenu
              icon={<MoreVertIcon fontSize={insideTask ? 'small' : 'medium'} />}
              forceClose={!open}
              tooltipPosition='top'
              disabled={isArchived}
              slots={{ tooltip: TaskTooltip }}
              slotProps={menuSlotProps}
              onClick={() => setOpen(true)}
              label={state => getMenuLabel(state, 'taskActionsLabel', 'tasks')}>
              {(menuOpen, triggerExit) => (
                <Suspense fallback={<TaskActionsSkeleton />}>
                  {menuOpen ? (
                    <TaskActions 
                      id={id}
                      parentId={parentId}
                      subtaskIds={subtaskIds}
                      members={members}
                      rawDate={initialDate}
                      priority={priority}
                      onDateChange={handleDateChange}
                      menuHandler={triggerExit}
                    />
                  ): null}
                </Suspense>
              )}
            </DropdownMenu>
          </>
        ): null
      }
    />
  )
}
