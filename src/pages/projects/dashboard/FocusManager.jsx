import { createPortal, lazy, Suspense } from 'preact/compat'
import useApp from '@hooks/useApp'

import useDocumentTitleTimer from '@hooks/tasks/useDocumentTitleTimer'
import useFocusSession from '@hooks/tasks/useFocusSession'
import useFocusShortcuts from '@hooks/tasks/useFocusShortcuts'

import { isWorking, showOverlay } from '@stores/task'

const LazyOverlay = lazy(() => import('./FocusOverlay'))
const LazyFab = lazy(() => import('./FocusFab'))
const LazyZenStatus = lazy(() => import('./ZenModeStatus'))

function ActiveFocusSession() {
  const { isMobile } = useApp()
  const zenRoot = document.getElementById('zen-portal-root')

  useDocumentTitleTimer()
  useFocusSession()
  useFocusShortcuts()

  return (
    <Suspense fallback={null}>
      <LazyOverlay />

      {!showOverlay.value && (
        isMobile
          ? <LazyFab />
          : (zenRoot
            ? createPortal(
              <Suspense fallback={null}>
                <LazyZenStatus />
              </Suspense>, zenRoot)
            : null)
      )}
    </Suspense>
  )
}

export default function FocusManager() {
  if (!isWorking.value) return null

  return <ActiveFocusSession />
}
