import ArchiveIcon from '@mui/icons-material/Inventory2Outlined'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import useTasks from '@hooks/useTasks'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import useApp from '@hooks/useApp'

export default function ArchiveButton() {
  const { t } = useTranslation('tasks')
  const { tasks, actions } = useTasks()
  const { appNotification } = useApp()
  const { id: projectId, data: projectData } = useProject()

  const tasksToArchive = useMemo(() => {
    const toArchive = []
    if (!tasks) return toArchive

    for (const task of tasks) {
      const isProcessable = task.status === 'done' || task.status === 'cancelled'

      if (task.isArchived || !isProcessable) continue

      toArchive.push(task.id)
    }
    return toArchive
  }, [tasks])

  const count = tasksToArchive.length

  const handleArchive = async () => {
    if (count === 0) return

    try {
      await actions.archiveTasks(tasksToArchive)
      appNotification({
        message: t('notifications.tasksArchived'),
        severity: 'success'
      })
    } catch (error) {
      console.error('Error archiving tasks:', error)
    }
  }

  if (count === 0) return

  return (
    <Tooltip title={t('buttons.archiveCount', { count })}>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
        <IconButton
          onClick={handleArchive}
          sx={theme => ({
            color: theme.lighten(theme.palette.warning.main, 0.125),
            ...(theme.applyStyles('dark', {
              color: theme.darken(theme.palette.warning.main, 0.125)
            })),
            borderRadius: '50%',
            p: 1
          })}
          disabled={projectData?.isArchived}>
          <Badge
            badgeContent={count}
            color='error'
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.65rem',
                height: 16,
                minWidth: 16
              }
            }}>
            <ArchiveIcon fontSize='medium' />
          </Badge>
        </IconButton>

        <Typography
          variant='caption'
          sx={{
            display: { xs: 'none', md: 'block' },
            ml: 0.5,
            fontWeight: 'bold',
            color: 'text.secondary',
            textTransform: 'uppercase',
            fontSize: '0.65rem'
          }}>
          {t('buttons.archive')}
        </Typography>
      </Box>
    </Tooltip>
  )
}
