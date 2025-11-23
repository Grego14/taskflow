import LinkIcon from '@mui/icons-material/Link'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

import useTasks from '@hooks/useTasks'
import { useRef } from 'react'

export default function ParentTaskLink({ parentTask }) {
  const { scrollIntoTask, tasks } = useTasks()

  const { ref: parentRef, title: parentTitle } =
    tasks?.find(task => task.id === parentTask) || {}

  const timeout = useRef(null)

  return (
    <Box
      className='flex'
      alignItems='center'
      sx={{ cursor: 'pointer' }}
      data-parenttask={parentTask}
      onClick={e => {
        scrollIntoTask(e)

        clearTimeout(timeout.current)
        parentRef?.current?.setAttribute('data-focused', true)
        timeout.current = setTimeout(() => {
          parentRef?.current?.removeAttribute('data-focused')
        }, 1500)
      }}>
      <Tooltip
        title={parentTitle}
        slotProps={{ popper: { sx: { textAlign: 'center' } } }}>
        <LinkIcon fontSize='small' />
      </Tooltip>
    </Box>
  )
}
