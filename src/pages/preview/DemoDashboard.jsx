import { useState, Suspense, lazy } from 'preact/compat'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import AddIcon from '@mui/icons-material/Add'
import AddButton from '@components/ui/tasks/buttons/AddButton'
import ListTask from '@components/ui/tasks/list/ListTask'

import LayoutProvider from '@context/LayoutContext'
import LayoutManager from '@components/ui/layoutmanager/LayoutManager'

import ProjectAppBar from '../projects/ProjectAppBar'
import ProjectDashBoard from '../projects/dashboard/ProjectDashboard'

const UpsellDialog = lazy(() => import('./UpsellDialog'))

import { useEffect } from 'preact/hooks'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from '@mui/material/styles'
import useProject from '@hooks/useProject'
import useTasks from '@hooks/useTasks'
import useUser from '@hooks/useUser'

import getLocale from '@utils/getLocale'
import { username, userId, UPPSELL_KEYS } from '@context/MockContext/utils'

function DemoDashboard() {
  const { t } = useTranslation('preview')
  const { tasks } = useTasks()
  const { data } = useProject()

  const topLevelTasks = tasks?.filter(t => !t.subtask) || []

  return (
    <>
      <ProjectAppBar />

      <Suspense fallback={null}>
        <ProjectDashBoard />
      </Suspense>
    </>
  )
}

export default function DemoWrapper() {
  const { i18n } = useTranslation()
  const { mode, systemMode } = useColorScheme()
  const userTheme = mode === 'system' ? systemMode : mode
  const { setUser } = useUser()

  const { tasks } = useTasks()

  const [showUpsell, setShowUpsell] = useState(false)
  const [upsellContext, setUpsellContext] = useState('')

  useEffect(() => {
    setUser({
      preferences: {
        theme: userTheme,
        lang: i18n.language || 'en',
        previewer: 'list',
        locale: getLocale(i18n.language || 'en')
      },
      metadata: {
        lastUsedFilter: 'default',
        lastEditedProject: '',
        lastEditedProjectOwner: '',
        lastUsedMetricFilter: ''
      },
      profile: {
        username: username,
        avatar: '',
        email: null,
        anonymous: true
      },
      uid: userId
    })
  }, [userTheme])

  const triggerUpsell = (reason) => {
    setUpsellContext(reason)
    setShowUpsell(true)
  }

  return (
    <LayoutProvider isPreview triggerUpsell={triggerUpsell}>
      <LayoutManager>
        <DemoDashboard />
      </LayoutManager>

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
