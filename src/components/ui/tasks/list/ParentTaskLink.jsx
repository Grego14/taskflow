import LinkIcon from '@mui/icons-material/Link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import useTasks from '@hooks/useTasks'
import { useRef } from 'react'

const textSizes = {
  normal: { xs: '25ch', mobile: '35ch', tablet: '50ch' },
  overdue: { xs: '18ch', mobile: '28ch', tablet: '42ch' }
}

export default function ParentTaskLink({ parentTask, isOverdue }) {
  const { scrollIntoTask, taskRefs, tasks } = useTasks()

  const { title } = tasks?.find(task => task.id === parentTask) || {}
  const parentRef = taskRefs.current?.[parentTask]
  const timeout = useRef(null)
  const text = `Parent task: ${title}`

  return (
    <Box
      className='flex'
      alignItems='center'
      sx={{ cursor: 'pointer' }}
      onClick={e => scrollIntoTask(parentTask)}>
      <Box className='flex flex-center' gap={0.5}>
        <LinkIcon fontSize='small' />
        <Typography
          variant='caption'
          color='textSecondary'
          sx={{
            display: 'inline-block',
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            textWrap: 'nowrap',
            maxWidth: textSizes[isOverdue ? 'overdue' : 'normal']
          }}>
          {text}
        </Typography>
      </Box>
    </Box>
  )
}
