import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'

import formatTimeAgo from '@utils/formatTimeAgo'
import formatTimestamp from '@utils/formatTimestamp'

export default function ProjectMetadata() {
  const { preferences } = useUser()
  const { t } = useTranslation('projects')
  const { data, projectMembers, isArchived } = useProject()

  const projectOwnerData = projectMembers?.find(
    member => member.id === data?.createdBy
  )

  return (
    <Box>
      <Metadata text={t('settings.createdBy')}>
        <Typography variant='caption' sx={{ font: 'inherit', fontWeight: 600 }}>
          {projectOwnerData?.username}
        </Typography>
      </Metadata>
      <Metadata text={t('settings.createdAt')}>
        <Typography variant='caption' sx={{ font: 'inherit', fontWeight: 600 }}>
          {formatTimestamp(data?.createdAt)?.shortDate}
        </Typography>
      </Metadata>
      {isArchived && (
        <Metadata text={t('settings.archivedAt')}>
          <Typography
            variant='caption'
            sx={{ font: 'inherit', fontWeight: 600 }}>
            {formatTimeAgo(new Date(data?.archivedDate), preferences.locale)}
          </Typography>
        </Metadata>
      )}
      <Metadata text={t('settings.isTemplate')}>
        <Switch disabled checked={data?.isTemplate} />
      </Metadata>
    </Box>
  )
}

function Metadata({ children, text }) {
  return (
    <Typography
      className='flex'
      variant='body2'
      sx={{ justifyContent: 'space-between', mt: 1.5 }}>
      {text}
      {children}
    </Typography>
  )
}
