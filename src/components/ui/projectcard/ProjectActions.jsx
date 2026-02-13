import ArchiveProject from './menu_actions/ArchiveProject'
import DeleteProject from './menu_actions/DeleteProject'
import Box from '@mui/material/Box'

import { Suspense, lazy } from 'react'
const AbandonProject = lazy(() => import('./menu_actions/AbandonProject'))

export default function ProjectActions({ id, archived, isOwner, owner }) {
  return (
    <Box py={1} role='none'>
      {isOwner && (
        <>
          <DeleteProject id={id} />
          {!archived && <ArchiveProject id={id} />}
        </>
      )}
      {!isOwner && (
        <Suspense fallback={null}>
          <AbandonProject id={id} owner={owner} />
        </Suspense>
      )}
    </Box>
  )
}
