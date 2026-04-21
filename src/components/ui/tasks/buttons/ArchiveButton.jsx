import ArchiveIcon from '@mui/icons-material/Inventory2Outlined'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import ButtonListItem from '@components/reusable/buttons/ButtonListItem'

import useTasks from '@hooks/useTasks'
import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import useApp from '@hooks/useApp'

import { setGlobalAlert } from '@stores/ui'
import { taskRegistry } from '@stores/task'

export default function ArchiveButton() {
  const { t } = useTranslation('tasks')
  const { actions } = useTasks()
  const { isMobile } = useApp()
  const { id: projectId, data: projectData } = useProject()

  const tasksToArchive = useMemo(() => {
    const toArchive = []
    const registry = taskRegistry.value

    for (const task of registry.values()) {
      const isProcessable = task.status === 'done' 
        || task.status === 'cancelled'

      if (isProcessable && !task.isArchived) toArchive.push(task.id)
    }

    return toArchive
  }, [taskRegistry.value])

  const count = tasksToArchive.length

  const handleArchive = async () => {
    if (count === 0) return

    try {
      await actions.archiveTasks(tasksToArchive)
      setGlobalAlert({
        message: t('notifications.tasksArchived'),
        severity: 'success'
      })
    } catch (error) {
      console.error('Error archiving tasks:', error)
    }
  }

  const buttonProps = {
    onClick: handleArchive,
    sx: theme => ({
      color: theme.lighten(theme.palette.warning.main, 0.125),
      ...(theme.applyStyles('dark', {
        color: theme.darken(theme.palette.warning.main, 0.125)
      })),
      borderRadius: !isMobile ? '50%' : 1,
      borderColor: isMobile ?
        theme.darken(theme.palette.warning.main, 0.25)
        : 'none',
      p: 1,
      display:
        // always render on laptop/desktop devices
        !isMobile ? 'inline-flex' :
          count ? 'inline-flex' : 'none'
    }),
    disabled: projectData?.isArchived,
    variant: isMobile ? 'outlined' : 'text'
  }

  const button = isMobile ?
    (
      <Button {...buttonProps}>
        {t('buttons.archiveCount', { count })}
      </Button>
    )
    : (
      // the icon button is used inside the appbar list
      <ButtonListItem component={IconButton}
        btnProps={{
          ...buttonProps,
          className: 'hide-element'
        }}>
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
      </ButtonListItem>
    )

  return !isMobile ? (
    <Tooltip title={t('buttons.archiveCount', { count })}>
      {button}
    </Tooltip>
  ) : button
}
