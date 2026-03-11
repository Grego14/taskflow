import { useMemo, useState, Suspense, lazy } from 'preact/compat'

import DropdownMenu from '@components/reusable/DropdownMenu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import UpdatableTaskTitle from './UpdatableTaskTitle'
import TaskMembers from './TaskMembers'
import SmartDateLabel from './SmartDateLabel'
import TaskCalendar from './TaskCalendar'

const TaskActions = lazy(() => import('@components/ui/tasks/buttons/TaskActions'))

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import formatTimeAgo from '@utils/formatTimeAgo'
import formatTimestamp from '@utils/formatTimestamp'
import getMenuLabel from '@utils/getMenuLabel'

export default function Header({ data, insideTask = false, status }) {
  const { isOnlyMobile } = useApp()
  const { t } = useTranslation('tasks')
  const { isArchived } = useProject()
  const { preferences } = useUser()

  const [showTitle, setShowTitle] = useState(false)
  const [open, setOpen] = useState(false)

  const locale = preferences?.locale
  const isDone = status === 'done'
  const isCancelled = status === 'cancelled'

  if (!data) return null

  const {
    id,
    subtasks,
    subtask,
    isSubtask,
    assignedTo: members,
    rawDate,
    priority,
    title,
    dueDate,
    isParentChecked
  } = data

  const actionsData = {
    id,
    isSubtask,
    subtask,
    subtasks,
    members,
    rawDate,
    priority
  }

  const isChecked = isDone || isCancelled

  return (
    <CardHeader
      className='flex-center'
      sx={{ p: 0, width: '100%' }}
      disableTypography
      slotProps={{
        action: {
          sx: { my: 'auto', display: 'flex', gap: 1 },
          className: !insideTask ? 'task' : 'subtask'
        }
      }}
      title={
        <UpdatableTaskTitle
          title={title}
          taskId={id}
          isChecked={isChecked}
          isCancelled={isCancelled}
          subtask={subtask}
          show={showTitle}
          setShow={setShowTitle}
        />
      }
      action={
        !showTitle && (
          <>
            {(dueDate && !isChecked && !isParentChecked)
              && <SmartDateLabel date={dueDate} />}

            <TaskMembers
              assignedTo={members}
              subtasks={subtasks}
              insideTask={insideTask}
            />

            {!isOnlyMobile && (
              <TaskCalendar
                rawDate={rawDate}
                taskId={id}
                parentId={subtask}
                insideTask={insideTask}
              />
            )}

            <DropdownMenu
              icon={<MoreVertIcon fontSize={insideTask ? 'small' : 'medium'} />}
              forceClose={!open}
              tooltipPosition='top'
              disabled={isArchived}
              onClick={() => setOpen(true)}
              label={state => getMenuLabel(state, 'taskActionsLabel', 'tasks')}>
              {(menuOpen, triggerExit) => (
                <Suspense fallback={null}>
                  {menuOpen && (
                    <TaskActions {...actionsData} menuHandler={triggerExit} />
                  )}
                </Suspense>
              )}
            </DropdownMenu>
          </>
        )
      }
    />
  )
}
