import AssignMembers from './AssignMembers'
import CreateSubtask from './CreateSubtask'
import DeleteTask from './DeleteTask'
import ReassignDate from './ReassignDate'

export default function TaskActions({
  id,
  isSubtask = false,
  subtask,
  members,
  menuHandler,
  rawDate
}) {
  if (!id) return null

  return (
    <>
      <DeleteTask id={id} subtask={isSubtask ? subtask : null} />
      {!isSubtask && <CreateSubtask id={id} showMenu={menuHandler} />}
      <AssignMembers
        showMenu={menuHandler}
        members={members}
        id={id}
        subtask={subtask}
      />
      <ReassignDate rawDate={rawDate} id={id} subtask={subtask} />
    </>
  )
}
