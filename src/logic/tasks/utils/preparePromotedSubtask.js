export default function preparePromotedSubtask(
  subtaskData, 
  position, 
  timestamp
) {
  const { 
    id: _id,
    ref: _ref,
    status: _status,
    subtask: _subtask,
    parentId: _parentId, 
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...other 
  } = subtaskData

  return {
    ...other,
    status: 'todo',
    parentId: null, // now is a "parent" task
    position,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
