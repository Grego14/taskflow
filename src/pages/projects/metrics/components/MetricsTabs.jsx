import useApp from '@hooks/useApp'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useTranslation } from 'react-i18next'

import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'

const tabs = [
  { value: 'project', icon: <DashboardIcon fontSize='small' /> },
  { value: 'members', icon: <PeopleIcon fontSize='small' /> }
]

export default function MetricsTabs({ preview, setPreview }) {
  const { t } = useTranslation('metrics')
  const { isMobile } = useApp()

  return (
    <Tabs
      value={preview}
      onChange={(_, preview) => setPreview(preview)}
      aria-label={t('previewSwitcher')}
      indicatorColor={'primary'}
      slotProps={{
        list: { className: isMobile ? 'flex flex-column flex-center' : '' }
      }}
      centered>
      {tabs.map(tab => (
        <Tab
          label={t(`tabs.${tab.value}`)}
          aria-label={t(`tabs.${tab.value}`)}
          key={tab.value}
          value={tab.value}
          icon={tab.icon}
        />
      ))}
    </Tabs>
  )
}
