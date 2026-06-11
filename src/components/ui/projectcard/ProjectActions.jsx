import Box from '@mui/material/Box'

import { Suspense, lazy } from 'react'

const AbandonProject = lazy(() => import('@components/ui/projects/actions/AbandonProject'))
const DeleteProject = lazy(() => import('@components/ui/projects/actions/DeleteProject'))
const ArchiveProject = lazy(() => import('@components/ui/projects/actions/ArchiveProject'))

import '@styles/components/ui/projects/projectActions.css'

export default function ProjectActions({ id, archived, isOwner, owner }) {
  return (
    <Suspense fallback={null}>
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
