import { useState, Suspense, lazy } from 'preact/compat'

import LayoutProvider from '@context/LayoutContext'
import LayoutManager from '@components/ui/layoutmanager/LayoutManager'

import ProjectAppBar from '../projects/ProjectAppBar'
import ProjectDashBoard from '../projects/dashboard/ProjectDashboard'

const UpsellDialog = lazy(() => import('./UpsellDialog'))

import MockProvider from '@context/MockContext'

function DemoDashboard() {
  return (
    <>
      <ProjectAppBar />
      <ProjectDashBoard />
    </>
  )
}

export default function DemoWrapper() {
  const [showUpsell, setShowUpsell] = useState(false)
  const [upsellContext, setUpsellContext] = useState('')

  const triggerUpsell = (reason) => {
    setUpsellContext(reason)
    setShowUpsell(true)
  }

  return (
    <LayoutProvider isPreview triggerUpsell={triggerUpsell}>
      <MockProvider>
        <LayoutManager>
          <DemoDashboard />
        </LayoutManager>
      </MockProvider>

      {showUpsell && (
        <Suspense fallback={null}>
          <UpsellDialog
            open={showUpsell}
            setOpen={setShowUpsell}
            upsellKey={upsellContext}
          />
        </Suspense>
      )}
    </LayoutProvider>
  )
}
