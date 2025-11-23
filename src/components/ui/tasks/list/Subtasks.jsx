import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CompleteButton from './CompleteButton'
import Content from './Content'
import Header from './Header'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Subtasks({ data, contextMenuHandler }) {
  const { t } = useTranslation('ui')

  if (data?.length < 1) return null

  return (
    <Accordion sx={{ '&.Mui-expanded': { m: 0 } }} elevation={3}>
      <AccordionSummary
        expandIcon={
          <ChevronLeftIcon fontSize='small' sx={{ rotate: '-90deg' }} />
        }
        sx={{
          '& .MuiAccordionSummary-content': {
            flexGrow: 0,
            '&.Mui-expanded': { my: 2 }
          },
          '&.MuiAccordionSummary-root': {
            minHeight: 0,
            gap: 2
          }
        }}>
        {t('tasks.subtasks', { count: data?.length })}
      </AccordionSummary>
      <AccordionDetails
        sx={{
          pt: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
        {data?.map(subtask =>
          subtask?.id ? (
            <Subtask
              key={subtask.id}
              data={subtask}
              onContextMenu={contextMenuHandler}
            />
          ) : null
        )}
      </AccordionDetails>
    </Accordion>
  )
}

function Subtask(props) {
  const { data, ...other } = props
  const [status, setStatus] = useState(data?.status)

  if (!data?.id || !data?.subtask) return null

  const isChecked = data?.status === 'done' || data?.status === 'cancelled'

  // if a member updates a task status this synchronizes it
  useEffect(() => {
    if (data?.status && status !== data?.status) {
      setStatus(data.status)
    }
  }, [status, data?.status])

  return (
    <Card
      className='flex flex-column'
      sx={{
        width: '100%',
        '&.MuiCard-root:last-child': { mt: 0 },
        p: 2,
        py: 1.5,
        opacity: isChecked ? 0.75 : 1
      }}
      data-task-id={data?.id}
      data-is-subtask={true}
      data-parent-id={data?.subtask}
      elevation={4}
      {...other}>
      <Box className='flex' sx={{ width: '100%' }}>
        <CompleteButton id={data?.id} status={status} setStatus={setStatus} />
        <Header data={data} insideTask={true} status={status} />
      </Box>
      <Content data={data} insideTask={true} status={status} />
    </Card>
  )
}
