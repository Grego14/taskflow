import { Suspense, lazy } from 'react'

import CircleLoader from '@components/reusable/loaders/CircleLoader'
import Box from '@mui/material/Box'

const ListPreview = lazy(
  () => import('@components/ui/previews/list/ListPreview')
)
const KanbanPreview = lazy(
  () => import('@components/ui/previews/kanban/KanbanPreview')
)

import { useTranslation } from 'react-i18next'
import useTasks from '@hooks/useTasks'
import useUser from '@hooks/useUser'

export default function TasksPreviewer() {
  const { t } = useTranslation('tasks')
  const { preferences } = useUser()
  const { loading } = useTasks()

  const actualPreview = preferences?.previewer

  return (
    <Box className='flex flex-grow'>
      {loading && <CircleLoader text={t('loading')} height='auto' />}

      <Suspense fallback={null}>
        {!loading &&
          (actualPreview === 'kanban'
            ? <KanbanPreview />
            : <ListPreview />)}
      </Suspense>
    </Box>
  )
}
