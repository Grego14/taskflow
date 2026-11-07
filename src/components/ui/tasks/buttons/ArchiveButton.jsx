import AppTooltip from '@components/reusable/AppTooltip'
import ButtonListItem from '@components/reusable/buttons/ButtonListItem'
import ArchiveIcon from '@mui/icons-material/Inventory2Outlined'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import useApp from '@hooks/useApp'
import useLayout from '@hooks/useLayout'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useCallback, useMemo } from 'preact/hooks'
import { useTranslation } from 'react-i18next'

import { tasksToArchiveIds } from '@stores/task'
import { setGlobalAlert } from '@stores/ui'

import '@styles/components/buttons/archiveButton.css'

export default function ArchiveButton() {
  const { t } = useTranslation('tasks')
  const { actions } = useTasks()
  const { isMobile } = useApp()
  const { isPreview } = useLayout()
  const { id: projectId, data: projectData } = useProject()

  const toArchive = tasksToArchiveIds.value
  const count = toArchive.length

  const handleArchive = useCallback(async () => {
    if (count === 0) return

    try {
      await actions.archiveTasks(toArchive)

      if (!isPreview) {
        setGlobalAlert({
          message: t('notifications.tasksArchived'),
          severity: 'success'
        })
      }
    } catch (error) {
      console.error('Error archiving tasks:', error)
    }
  }, [toArchive, count, actions.archiveTasks, t, isPreview])

  const btnClass = `
    archive-btn 
    ${count ? 'has-items' : ''} 
    ${!isMobile ? 'hide-element' : ''}
  `

  const buttonProps = useMemo(
    () => ({
      onClick: handleArchive,
      disabled: projectData?.isArchived,
      className: btnClass,
      variant: isMobile ? 'outlined' : 'text'
    }),
    [isMobile, projectData?.isArchived, handleArchive, btnClass]
  )

  const button = isMobile ? (
    <Button {...buttonProps}>{t('buttons.archiveCount', { count })}</Button>
  ) : (
    // the icon button is used inside the appbar list
    <ButtonListItem component={IconButton} btnProps={buttonProps}>
      <Badge badgeContent={count} color='error' className='archive-btn__badge'>
        <ArchiveIcon fontSize='medium' />
      </Badge>
    </ButtonListItem>
  )

  return !isMobile ? (
    <AppTooltip title={t('buttons.archiveCount', { count })}>
      {button}
    </AppTooltip>
  ) : (
    button
  )
}
