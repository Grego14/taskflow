import { Suspense, lazy, memo, useEffect, useRef, useState } from 'react'

// components
import CircleLoader from '@components/reusable/loaders/CircleLoader'
import Box from '@mui/material/Box'

const ListPreview = lazy(
  () => import('@components/ui/previews/list/ListPreview')
)
const KanbanPreview = lazy(
  () => import('@components/ui/previews/kanban/KanbanPreview')
)
import TaskActionsProvider from '@context/TaskActionsContext'

// hooks
import useTasks from '@hooks/useTasks'
import { useTranslation } from 'react-i18next'

// utils
import tasksActionsHandler from './tasksActionsHandler.js'

export default memo(function TasksPreviewer({ actualPreview }) {
  const { t } = useTranslation('ui')
  const { loading } = useTasks()

  return (
    <Box className='flex flex-grow'>
      {loading && <CircleLoader text={t('tasks.loading')} height='auto' />}

      <TaskActionsProvider>
        <Suspense fallback={null}>
          {!loading &&
            (actualPreview === 'kanban' ? <KanbanPreview /> : <ListPreview />)}
        </Suspense>
      </TaskActionsProvider>
    </Box>
  )
})
