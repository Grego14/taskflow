import { 
  rootTaskIds,
  taskRegistry, 
  createTaskLocal, 
  deleteTaskLocal, 
  updateTaskLocal,
  archiveTasksLocal
} from './task'
import resolveTaskStatusUpdate from '@utils/tasks/taskStatusResolver'

describe('Task Store', () => {
  it('Should initialize with an empty Map', () => {
    expect(taskRegistry.value instanceof Map).toBe(true)
    expect(taskRegistry.value.size).toBe(0)
  })

  it('createTaskLocal should insert a task correctly', () => {
    const id = 'task-123'
    const title = 'Learn testing'

    const mockTask = { id, title }
    createTaskLocal(mockTask)

    expect(taskRegistry.value.has(id)).toBe(true)
    expect(taskRegistry.value.get(id).title).toBe(title)
  })
})

// *** task/subtask deletion and task cascade deletion ***
describe('Task Store - Deletion', () => {
  beforeEach(() => { taskRegistry.value = new Map() })

  it('should remove a single task by ID', () => {
    const id = 'task-1'
    createTaskLocal({ id, title: 'Single Task' })
    
    deleteTaskLocal(id)
    
    expect(taskRegistry.value.has(id)).toBe(false)
  })

  const parentId = 'parent-1'
  const subtaskId = 'sub-1'
  const parentTitle = 'Parent Task'
  const subtaskTitle = 'Subtask'

  it('should remove subtasks when a parent task is deleted (cascading)', () => {
    // create parent and child
    createTaskLocal({ id: parentId, title: parentTitle, parentId: null })
    createTaskLocal({ id: subtaskId, title: subtaskTitle, parentId: parentId })

    // delete parent with cascade flag
    deleteTaskLocal(parentId, null, true)

    expect(taskRegistry.value.has(parentId)).toBe(false)
    expect(taskRegistry.value.has(subtaskId)).toBe(false)
    expect(taskRegistry.value.size).toBe(0)
  })

  it('should NOT remove subtasks if it is NOT a parent deletion', () => {
    createTaskLocal({ id: parentId, title: parentTitle })
    createTaskLocal({ id: subtaskId, title: subtaskTitle, parentId: parentId })

    // delete subtask only
    deleteTaskLocal(subtaskId, parentId, false)

    expect(taskRegistry.value.has(subtaskId)).toBe(false)
    expect(taskRegistry.value.has(parentId)).toBe(true)
  })
})

// *** task partial update ***
describe('Task Store - Updates', () => {
  beforeEach(() => { taskRegistry.value = new Map() })

  it('should update task data partially without losing existing properties', () => {
    const id = 'task-1'
    const priority = 'high'
    const timeWorked = 0

    createTaskLocal({ 
      id, 
      title: 'Initial Title', 
      priority,
      timeWorked 
    })

    const updatedTitle = 'Updated Title'

    // Update only the title
    updateTaskLocal(id, { title: updatedTitle })

    const updatedTask = taskRegistry.value.get(id)
    expect(updatedTask.title).toBe(updatedTitle)
    expect(updatedTask.priority).toBe(priority)
    expect(updatedTask.timeWorked).toBe(timeWorked)
  })

  it('should do nothing if the task ID does not exist', () => {
    updateTaskLocal('non-existent', { title: 'Ghost' })
    expect(taskRegistry.value.size).toBe(0)
  })
})

// *** check Task Registry and Root Indexing ***
describe('Task Store - Atomic Registry', () => {
  beforeEach(() => { taskRegistry.value = new Map() })

  it('taskRegistry should store tasks flat and rootTaskIds should index only parents', () => {
    const parentId = '1'
    const parentTitle = 'Parent Task'
    const subtaskId = '2'

    createTaskLocal({ id: parentId, title: parentTitle, subtasks: [] })
    createTaskLocal({ id: subtaskId, title: 'Subtask', parentId: parentId })

    const registry = taskRegistry.value
    const roots = rootTaskIds.value

    // the registry should have both tasks
    expect(registry.size).toBe(2)
    expect(registry.get(parentId).title).toBe(parentTitle)

    // rootTaskIds should only have the id of the parent
    expect(roots.length).toBe(1)
    expect(roots[0]).toBe(parentId)
    
    // the parent task should have the subtask id inside his subtasks field
    expect(registry.get(parentId).subtasks).toContain(subtaskId)
  })

  it('should maintain atomic integrity when a task is updated', () => {
    const id = '1'
    const newTitle = 'New Title'
    const newStatus = 'done'

    createTaskLocal({ id, title: 'Old Title', status: 'todo' })
    updateTaskLocal(id, { title: newTitle, status: newStatus })
    
    const task = taskRegistry.value.get(id)
    expect(task.title).toBe(newTitle)
    expect(task.status).toBe(newStatus)
  })
})

// *** archive tasks ***
it('should mark multiple tasks as archived in the Map', () => {
  createTaskLocal({ id: 't1', isArchived: false })
  createTaskLocal({ id: 't2', isArchived: false })
  createTaskLocal({ id: 't3', isArchived: false })
  
  archiveTasksLocal(['t1', 't2'])
  
  expect(taskRegistry.value.get('t1').isArchived).toBe(true)
  expect(taskRegistry.value.get('t2').isArchived).toBe(true)
  expect(taskRegistry.value.get('t3').isArchived).toBe(false)
})

// *** wasOnTime task metric ***
describe('Status Resolver Metrics', () => {
  const status = 'done'
  const uid = 'user-1'

  it('should mark wasOnTime as true if task is completed before dueDate', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const taskData = { dueDate: tomorrow }

    // isPreview = false
    const fields = resolveTaskStatusUpdate(taskData, status, uid, false)
    
    expect(fields.wasOnTime).toBe(true)
  })

  it('should mark wasOnTime as false if task is completed after dueDate', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const taskData = { dueDate: yesterday }
    const fields = resolveTaskStatusUpdate(taskData, status, uid, false)

    expect(fields.wasOnTime).toBe(false)
  })

  it('should leave wasOnTime as null if in preview mode', () => {
    const taskData = { dueDate: new Date() }

    // isPreview = true
    const fields = resolveTaskStatusUpdate(taskData, status, uid, true)
    expect(fields.wasOnTime).toBe(null)
  })
})

