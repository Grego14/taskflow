import DropdownMenu from '@components/reusable/DropdownMenu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import TaskCalendar from './TaskCalendar'
import UpdatableTaskTitle from './UpdatableTaskTitle'
import TaskActions from './menu_components/TaskActions'
import TaskMembers from './TaskMembers'
import SmartDateLabel from './SmartDateLabel'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { useMemo, useState } from 'react'
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
  const isSubtask = data?.isSubtask
  const { id, subtask } = data

  if (!data) return null

  const actionsData = {
    id: id,
    isSubtask,
    subtask: subtask,
    members: data.assignedTo,
    rawDate: data.rawDate,
    priority: data.priority
  }

  return (
    <CardHeader
      className='flex-center'
      sx={{ p: 0, width: '100%' }}
      disableTypography
      slotProps={{ action: { sx: { my: 'auto' } } }}
      title={
        <UpdatableTaskTitle
          title={data.title}
          taskId={id}
          isChecked={isDone || isCancelled}
          isCancelled={isCancelled}
          subtask={insideTask}
          show={showTitle}
          setShow={setShowTitle}
        />
      }
      action={
        !showTitle && (
          <Box display='flex' gap={1}>
            {data.dueDate && <SmartDateLabel date={data.dueDate} />}

            <TaskMembers
              assignedTo={data.assignedTo}
              subtasks={data.subtasks}
              insideTask={insideTask}
            />

            {!isOnlyMobile && (
              <TaskCalendar
                rawDate={data?.rawDate}
                taskId={data.id}
                parentId={data.subtask}
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
              {(triggerExit) => (
                <TaskActions {...actionsData} menuHandler={triggerExit} />
              )}
            </DropdownMenu>
          </Box>
        )
      }
    />
  )
}
