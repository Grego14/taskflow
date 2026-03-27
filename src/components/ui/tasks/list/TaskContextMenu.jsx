import Menu from '@mui/material/Menu'
import TaskActions from '@components/ui/tasks/buttons/TaskActions'
import AnimatedMenu from '@components/reusable/animated/AnimatedMenu'

export default function TaskContextMenu({ data, open, setOpen }) {
  return (
    <AnimatedMenu open={open} onExitComplete={() => setOpen(null)}>
      {(renderOpen, setRef, triggerExit) => (
        <Menu
          open={renderOpen}
          onClose={triggerExit}
          anchorReference='anchorPosition'
          ref={setRef}
          anchorPosition={
            data ? { top: data.mouseY, left: data.mouseX } : undefined
          }>
          <TaskActions {...data?.actionsData} menuHandler={triggerExit} />
        </Menu>
      )}
    </AnimatedMenu>
  )
}
