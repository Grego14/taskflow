import ListTask from '@components/ui/tasks/list/ListTask'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import useApp from '@hooks/useApp'
import { forwardRef, memo } from 'react'

const TasksWrapper = forwardRef(function TasksWrapper(props, ref) {
  const { isMobile } = useApp()
  const {
    variant = 'body1',
    title,
    tasks,
    tasksStyles,
    containerStyles,
    divider = false,
    dragState,
    children = null,
    show = true
  } = props

  const hasTasks = tasks?.length > 0

  return (
    <Box
      className='flex flex-column'
      ref={ref}
      sx={{
        ...(!show && { display: 'none' }),
        gap: 1,
        mb: divider ? 4 : 0,
        '&.MuiBox-root:first-of-type': {
          // if there are not tasks we align the childrens to the middle
          my: hasTasks ? 4 : 'auto',
          ...containerStyles
        }
      }}>
      <Accordion elevation={0} defaultExpanded>
        <AccordionSummary
          sx={{
            '& .MuiAccordionSummary-content': {
              flexGrow: 0,
              mr: 2
            },
            width: 'fit-content',
            mx: 'auto'
          }}
          className='text-center'
          expandIcon={
            <ChevronLeftIcon fontSize='small' sx={{ rotate: '-90deg' }} />
          }>
          <Typography variant={variant}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={[
            {
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              p: 2,
              mx: isMobile ? 0.75 : 2
            },
            {
              border:
                dragState === 'is-over'
                  ? '3px dashed lightblue'
                  : '3px dashed transparent'
            },
            tasksStyles
          ]}>
          <Box className='flex flex-column' gap={2.5}>
            {show &&
              tasks?.map(task => (
                <ListTask key={task.id} data={task} subtask={task?.isSubtask} />
              ))}
            {children}
          </Box>
          {divider && (
            <Divider sx={{ mx: 4, width: '80%', alignSelf: 'center' }} />
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  )
})

export default memo(TasksWrapper)
