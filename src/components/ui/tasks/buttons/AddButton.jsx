import { Suspense, lazy, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/material/IconButton'
import AppTooltip from '@components/reusable/AppTooltip'
import ButtonListItem from '@components/reusable/buttons/ButtonListItem'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'

const NewTaskDialog = lazy(
  () => import('@components/reusable/dialogs/newtask/NewTaskDialog')
)

export default function AddButton({ isPreview }) {
  const { t } = useTranslation('tasks')
  const { isMobile } = useApp()
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const { data } = useProject()

  return (
    <>
      <AppTooltip title={t('buttons.add')}>
        <ButtonListItem
          component={IconButton}
          btnProps={{
            onClick: () => setTaskDialogOpen(true),
            disabled: data?.isArchived,
            className: 'project-action-btn add-task-btn hide-element'
          }}>
          <AddIcon fontSize='medium' />
        </ButtonListItem>
      </AppTooltip>

      {taskDialogOpen && (
        <Suspense fallback={null}>
          <NewTaskDialog
            open={taskDialogOpen}
            setOpen={setTaskDialogOpen}
            isArchived={data?.isArchived}
            isPreview
          />
        </Suspense>
      )}
    </>
  )
}
