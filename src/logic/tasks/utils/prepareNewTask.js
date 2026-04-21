export default function prepareNewTask({ 
  data, 
  id, 
  position, 
  parentId,
  ownerId,
  projectId
}){
  const { subtask: _subtask, ...task } = data
  // the firebase service will override this timestamp and use it's own
  // Timestamp object
  const timestamp = Date.now()

  const baseTask = {
    ...task,
    id, // client generated id
    parentId: parentId || null,
    position,

    status: 'todo',
    isArchived: false,

    createdAt: timestamp,
    updatedAt: timestamp,
    completedDate: null,
    cancelledDate: null,

    completedBy: null,
    cancelledBy: null,
    projectOwner: ownerId,
    projectId: projectId
  }

  return baseTask
}
