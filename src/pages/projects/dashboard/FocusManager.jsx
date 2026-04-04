import { createPortal, lazy, Suspense } from 'preact/compat'
import useApp from '@hooks/useApp'

import useDocumentTitleTimer from '@hooks/tasks/useDocumentTitleTimer'
import useFocusSession from '@hooks/tasks/useFocusSession'
import useFocusShortcuts from '@hooks/tasks/useFocusShortcuts'

import { isWorking, showOverlay } from '@stores/task'

const LazyOverlay = lazy(() => import('./FocusOverlay'))
const LazyFab = lazy(() => import('./FocusFab'))
const LazyZenStatus = lazy(() => import('./ZenModeStatus'))

export default function FocusManager() {
  const { isMobile } = useApp()

  useDocumentTitleTimer()
  useFocusSession()
  useFocusShortcuts()

  if (!isWorking.value) return null

  const zenRoot = document.getElementById('zen-portal-root')

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
