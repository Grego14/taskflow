import { Suspense, lazy, useState } from 'react'

// components
import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

// hooks
import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const NewTaskDialog = lazy(
  () => import('@components/reusable/dialogs/newtask/NewTaskDialog')
)

export default function AddButton() {
  const { t } = useTranslation('tasks')
  const { isMobile } = useApp()
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const { projectId } = useParams()
  const { data } = useProject()

  return (
    <>
      <Tooltip title={t('buttons.add')}>
        {/* mui needs the span wrapper if the button is disabled
        otherwise the tooltip doesn't appear */}
        <span>
          <IconButton
            onClick={() => setTaskDialogOpen(true)}
            sx={{
              minWidth: 'auto',
              borderRadius: '50%'
            }}
            disabled={data?.isArchived}>
            <AddIcon fontSize='medium' />
          </IconButton>
        </span>
      </Tooltip>

      {taskDialogOpen && (
        <Suspense fallback={null}>
          <NewTaskDialog
            open={taskDialogOpen}
            setOpen={setTaskDialogOpen}
            isArchived={data?.isArchived}
          />
        </Suspense>
      )}
    </>
  )
}
