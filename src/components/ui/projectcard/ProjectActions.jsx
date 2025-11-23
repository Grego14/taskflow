import ArchiveProject from './menu_actions/ArchiveProject'
import DeleteProject from './menu_actions/DeleteProject'

import { Suspense, lazy } from 'react'
const AbandonProject = lazy(() => import('./menu_actions/AbandonProject'))

export default function ProjectActions({ id, archived, isOwner, owner }) {
  return (
    <>
      {isOwner && (
        <>
          <DeleteProject id={id} />
          {!archived && <ArchiveProject id={id} />}
        </>
      )}
      {!isOwner && (
        <Suspense>
          <AbandonProject id={id} owner={owner} />
        </Suspense>
      )}
    </>
  )
}
