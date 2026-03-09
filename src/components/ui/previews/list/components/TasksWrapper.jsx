import ListTask from '@components/ui/tasks/list/ListTask'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import useApp from '@hooks/useApp'
import { forwardRef, memo, useRef, useState } from 'preact/compat'
import useTaskEntranceAnimation from '@hooks/animations/useTaskEntranceAnimation'

const TasksWrapper = forwardRef(function TasksWrapper(props, ref) {
  const { isMobile } = useApp()
  const {
    variant = 'body1',
    title,
    tasks = [],
    tasksStyles,
    containerStyles,
    divider = false,
    dragState,
    children = null,
    show = true,
    expand = true
  } = props

  const wrapperRef = useRef(null)

  const isOver = dragState === 'is-over'
  const hasTasks = tasks?.length > 0

  const [expanded, setExpanded] = useState(expand)

  useTaskEntranceAnimation(wrapperRef, tasks)

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
      <Accordion
        elevation={0}
        expanded={expanded}
        disableGutters
        onChange={(e, newValue) => setExpanded(newValue)}
        sx={{
          backgroundColor: 'transparent',
          backgroundImage: 'none'
        }}>
        <AccordionSummary
          sx={{
            // push the icon more to the right
            '& .MuiAccordionSummary-content': { mr: 2 },
            width: 'fit-content',
            mx: 'auto'
          }}
          className='text-center'
          expandIcon={
            tasks?.length !== 0 ?
              <ChevronLeftIcon fontSize='small' sx={{ rotate: '-90deg' }} />
              : null
          }>
          <Typography variant={variant} fontWeight={500} color='textSecondary'>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails
          className='flex flex-column'
          sx={[theme => (
            {
              gap: 4,
              p: 2,
              mx: { xs: 0.75, mobile: 2 },
              borderRadius: '12px',
              border: '2px dashed',
              borderColor: isOver ? 'primary.main' : 'transparent',
              backgroundColor: isOver ? theme.alpha('#fff', 0.075) : 'transparent',
              transition: 'border-color 0.3 ease, background-color 0.3 ease'
            }),
            tasksStyles
          ]}>
          <Box className='flex flex-column' ref={wrapperRef}>
            {show &&
              tasks?.map(task => (
                <ListTask key={task.id} data={task} subtask={task.subtask} />
              ))}
            {children}
          </Box>
          {(divider && hasTasks) && (
            <Divider sx={{ mx: 4, width: '80%', alignSelf: 'center' }} />
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  )
})

export default memo(TasksWrapper)
