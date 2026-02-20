import Box from '@mui/material/Box'

import { Suspense, lazy } from 'react'
const AbandonProject = lazy(() => import('@components/ui/projects/actions/AbandonProject'))
const DeleteProject = lazy(() => import('@components/ui/projects/actions/DeleteProject'))
const ArchiveProject = lazy(() => import('@components/ui/projects/actions/ArchiveProject'))

export default function ProjectActions({ id, archived, isOwner, owner }) {
  return (
    <Box py={1} role='none'>
      <Suspense fallback={null}>
        {isOwner && (
          <Box>
            <DeleteProject id={id} owner={owner} />
            {!archived && <ArchiveProject id={id} />}
          </Box>
        )}
        {isOwner && (
          <AbandonProject id={id} owner={owner} />
        )}
      </Suspense>
    </Box>
  )
}
