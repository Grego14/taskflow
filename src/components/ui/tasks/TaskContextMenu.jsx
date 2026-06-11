import { useMemo } from 'preact/hooks'

import Menu from '@mui/material/Menu'
import TaskActions from '@components/ui/tasks/buttons/TaskActions'
import AnimatedMenu from '@components/reusable/animated/AnimatedMenu'

import { taskRegistry } from '@stores/task'

const menuSlotProps = {
  paper: { className: 'task-menu-paper' },
  list: { sx: { overflow: 'hidden' } }
}

export default function TaskContextMenu({ data, open, setOpen }) {
  const taskData = useMemo(() => {
    if (!data?.id) return null

    const registry = taskRegistry.peek()
    return registry.get(data.id)?.peek()
  }, [data?.id])

  if(!data?.id) return null

  const actionsData = {
    id: taskData.id,
    isSubtask: !!taskData.parentId,
    parentId: taskData.parentId,
    subtasks: taskData.subtasks || [],
    members: taskData.assignedTo || [],
    rawDate: taskData.rawDate,
    priority: taskData.priority
  }
  
  return (
    <AnimatedMenu open={open} onExitComplete={() => setOpen(null)}>
      {(renderOpen, setRef, triggerExit) => (
        <Menu
          slotProps={menuSlotProps}
          open={renderOpen}
          onClose={triggerExit}
          anchorReference='anchorPosition'
          ref={setRef}
          anchorPosition={
            data ? { top: data.mouseY, left: data.mouseX } : undefined
          }>
          <TaskActions {...actionsData} menuHandler={triggerExit} />
        </Menu>
      )}
    </AnimatedMenu>
  )
}
