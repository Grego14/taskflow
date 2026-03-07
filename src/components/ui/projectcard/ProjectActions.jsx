import Box from '@mui/material/Box'

import { Suspense, lazy } from 'react'
import ActionsSkeleton from './ActionsSkeleton'

const AbandonProject = lazy(() => import('@components/ui/projects/actions/AbandonProject'))
const DeleteProject = lazy(() => import('@components/ui/projects/actions/DeleteProject'))
const ArchiveProject = lazy(() => import('@components/ui/projects/actions/ArchiveProject'))

export default function ProjectActions({ id, archived, isOwner, owner }) {
  return (
    <Suspense fallback={<ActionsSkeleton />}>
      <Box py={1.25} role='none'>
        {isOwner && (
          <>
            <DeleteProject id={id} owner={owner} />
            {!archived && <ArchiveProject id={id} />}
          </>
        )}
        {!isOwner && (
          <AbandonProject id={id} owner={owner} />
        )}
      </Box>
    </Suspense>
  )
}
