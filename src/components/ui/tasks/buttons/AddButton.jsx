import { Suspense, lazy, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
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
      <Tooltip title={t('buttons.add')}>
        <ButtonListItem
          component={IconButton}
          btnProps={{
            onClick: () => setTaskDialogOpen(true),
            disabled: data?.isArchived,
            sx: {
              minWidth: 'auto',
              borderRadius: '50%'
            },
            className: 'hide-element'
          }}>
          <AddIcon fontSize='medium' />
        </ButtonListItem>
      </Tooltip>

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
