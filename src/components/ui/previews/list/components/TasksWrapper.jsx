import ListTask from '@components/ui/tasks/list/ListTask'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { 
  forwardRef, 
  memo, 
  useRef, 
  useState, 
  useLayoutEffect, 
  useMemo,
  useCallback
} from 'preact/compat'
import useLayout from '@hooks/useLayout'
import useTasks from '@hooks/useTasks'
import useTaskAnimations from '@hooks/tasks/useTaskAnimations'

import { tasksReducer } from '@components/reusable/dialogs/newtask/tasksReducer'
import { alpha } from '@mui/material/styles'

const accordionStyles = {
  backgroundColor: 'transparent', 
  backgroundImage: 'none'
}

const TasksWrapper = forwardRef(function TasksWrapper(props, ref) {
  const {
    variant = 'body1',
    title,
    taskIds = [],
    containerStyles,
    divider = false,
    dragState,
    children = null,
    show = true,
    expand = true,
    type = null
  } = props

  const { setTaskRef } = useTasks()
  const { filter } = useLayout()
  const [expanded, setExpanded] = useState(expand)
  const wrapperRef = useRef(null)

  const isOver = dragState === 'is-over'
  const hasTasks = taskIds.length > 0

  const { animateEntrance } = useTaskAnimations()

  useLayoutEffect(() => {
    if (hasTasks) 
      animateEntrance(wrapperRef, taskIds, { addDelay: type === 'overdue' })
  }, [filter])

  const wrapperStyles = useMemo(() => ({
    display: show ? 'flex' : 'none',
    gap: 1,
    mb: divider ? 4 : 0,
    '&.MuiBox-root:first-of-type': {
      // if there are not tasks we align the childrens to the middle
      my: hasTasks ? 4 : 'auto',
      ...containerStyles
    },
    '& .MuiAccordionSummary-root': {
      '& .MuiAccordionSummary-content': { mr: hasTasks ? 2 : 0 },
      width: 'fit-content', 
      mx: 'auto' 
    }
  }), [hasTasks, show, divider, containerStyles])

  const detailsStyles = useMemo(() => ({
    gap: 4,
    p: 2,
    mx: { xs: 0.75, mobile: 2 },
    borderRadius: '12px',
    border: '2px dashed',
    borderColor: isOver ? 'primary.main' : 'transparent',
    backgroundColor: isOver ? alpha('#fff', 0.075) : 'transparent',
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
    overflow: 'hidden'
  }), [isOver])

  return (
    <Box className='flex flex-column' ref={ref} sx={wrapperStyles}>
      <Accordion
        elevation={0}
        expanded={expanded}
        disableGutters
        onChange={(e, val) => setExpanded(val)}
        sx={accordionStyles}>
        <AccordionSummary
          className='text-center'
          expandIcon={
            hasTasks ?
              <ChevronLeftIcon fontSize='small' sx={{ rotate: '-90deg' }} />
              : null
          }>
          <Typography
            className='text-center text-balance'
            variant={variant}
            fontWeight={500}
            color='textSecondary'>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails className='flex flex-column' sx={detailsStyles}>
          <Box className='flex flex-column' ref={wrapperRef}>
            {show ? taskIds.map(id => (
              <ListTask 
                key={id} 
                id={id}
                ref={el => setTaskRef(id, el)}
              />
            )) : null}
            {children}
          </Box>

          {(divider && hasTasks) ? (
            <Divider sx={{ mx: 4, width: '80%', alignSelf: 'center', mt: 2 }} />
          ) : null}
        </AccordionDetails>
      </Accordion>
    </Box>
  )
})

export default memo(TasksWrapper)
