import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import { Suspense, lazy, useState } from 'react'

const NewTaskDialog = lazy(
  () => import('@components/reusable/dialogs/newtask/NewTaskDialog')
)

import useProject from '@hooks/useProject'
import { useTranslation } from 'react-i18next'

export default function CreateTask({ sx }) {
  const { t } = useTranslation('tasks')
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const { isArchived } = useProject()

  return (
    <Button
      onClick={() => !isArchived && setTaskDialogOpen(true)}
      startIcon={<AddIcon sx={{ color: 'inherit' }} />}
      variant='contained'
      sx={{
        fontWeight: 'bold',
        width: 'fit-content',
        alignSelf: 'center',
        ...sx
      }}
      disabled={isArchived}>
      {t('createTask')}

      {taskDialogOpen && (
        <Suspense fallback={null}>
          <NewTaskDialog open={taskDialogOpen} setOpen={setTaskDialogOpen} />
        </Suspense>
      )}
    </Button>
  )
}
