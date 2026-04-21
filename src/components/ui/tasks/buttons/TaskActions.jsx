import AssignMembers from '@components/reusable/tasks/AssignMembers'
import CreateSubtask from './CreateSubtask'
import DeleteTask from './DeleteTask'
import ReassignDate from './ReassignDate'
import UpdatePriority from './UpdatePriority'
import Box from '@mui/material/Box'

export default function TaskActions({
  id,
  parentId,
  members,
  menuHandler,
  rawDate,
  priority,
  subtaskIds,
  onDateChange
}) {
  const isSubtask = !!parentId

  if (!id) return null

  return (
    <>
      <UpdatePriority
        priority={priority}
        id={id}
        parentId={parentId}
        showMenu={menuHandler}
      />

      {!isSubtask && <CreateSubtask id={id} showMenu={menuHandler} />}

      <AssignMembers id={id} members={members} parentId={parentId} />

      <ReassignDate 
        id={id} 
        parentId={parentId} 
        rawDate={rawDate}
        onDateChange={onDateChange}
      />

      <DeleteTask
        id={id}
        parentId={parentId}
        subtaskIds={subtaskIds}
        showMenu={menuHandler} 
      />
    </>
  )
}
