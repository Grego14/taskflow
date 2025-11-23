import Menu from '@mui/material/Menu'
import TaskActions from './menu_components/TaskActions'

export default function TaskContextMenu({ data, open, setOpen }) {
  return (
    <Menu
      open={open}
      onClose={() => setOpen(null)}
      anchorReference='anchorPosition'
      anchorPosition={
        data ? { top: data.mouseY, left: data.mouseX } : undefined
      }>
      {/* this allow us to use this menu on subtasks of this task so we save memory */}
      <TaskActions {...data?.actionsData} menuHandler={setOpen} />
    </Menu>
  )
}
