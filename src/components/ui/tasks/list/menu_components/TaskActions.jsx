import AssignMembers from './AssignMembers'
import CreateSubtask from './CreateSubtask'
import DeleteTask from './DeleteTask'
import ReassignDate from './ReassignDate'
import UpdatePriority from './UpdatePriority'
import Box from '@mui/material/Box'

export default function TaskActions({
  id,
  isSubtask = false,
  subtask, // this is the parent id if it's a subtask
  members,
  menuHandler,
  rawDate,
  priority,
}) {
  if (!id) return null

  return (
    <>
      <UpdatePriority priority={priority} id={id} subtask={subtask} />

      {!isSubtask && <CreateSubtask id={id} showMenu={menuHandler} />}

      <AssignMembers
        id={id}
        members={members}
        subtask={subtask}
        showMenu={menuHandler}
      />

      <ReassignDate id={id} subtask={subtask} rawDate={rawDate}
      />

      <DeleteTask id={id} subtask={subtask} showMenu={menuHandler} />
    </>
  )
}
