import BarChartIcon from '@mui/icons-material/BarChart'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsIcon from '@mui/icons-material/Settings'
import NavAction from '@components/reusable/NavAction'
import List from '@mui/material/List'

import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const items = [
  { translation: 'projectActions.dashboard', icon: DashboardIcon, to: '#' },
  { translation: 'projectActions.metrics', icon: BarChartIcon, to: 'metrics' },
  { translation: 'projectActions.settings', icon: SettingsIcon, to: 'settings' },
]

export default function ProjectActions({
  open,
  noTexts = false
}) {
  const { t } = useTranslation('ui')
  const { projectOwner, projectId } = useParams()

  return (
    <List
      className='flex flex-column flex-grow'
      sx={{ gap: 1.25 }}
      disablePadding>
      {items.map(row => {
        const { to, translation, ...other } = row

        const link = {
          to: `/projects/${projectOwner}/${projectId}/${to}`,
          translation: t(translation),
          ...other
        }

        return (
          <li>
            <NavAction
              key={`projectRow-${row.to}`}
              link={link}
              showText={open}
            />
          </li>
        )
      })}
    </List>
  )
}
