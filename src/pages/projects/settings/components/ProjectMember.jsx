import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import AppTooltip from '@components/reusable/AppTooltip'
import Typography from '@mui/material/Typography'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { useTranslation } from 'react-i18next'

const containerStyles = {
  my: 2,
  p: 2,
  justifyContent: 'space-between',
  backgroundColor: 'transparent'
}

export default function ProjectMember({
  data,
  isArchived,
  isOwner,
  isUser,
  removeMember,
  owner
}) {
  const { t } = useTranslation('projects')

  return (
    <Paper
      className='flex'
      sx={containerStyles}>
      <Box className='flex flex-center' gap={2}>
        <Avatar src={data?.avatar} />
        <Box className='flex flex-column' gap={1}>
          <Typography fontWeight={600}>{data?.username}</Typography>
          <Typography variant='body2'>{data?.email}</Typography>
        </Box>
      </Box>

      {/* the owner can't be kicked */}
      {!isUser && !(data.id === owner) && (
        <AppTooltip title={t('settings.removeMember')}>
          <span class='flex flex-center'>
            <IconButton
              data-member-id={data.id}
              aria-label={t('settings.removeMember')}
              onClick={removeMember}
              disabled={isArchived || !isOwner}>
              <PersonRemoveIcon />
            </IconButton>
          </span>
        </AppTooltip>
      )}
    </Paper>
  )
}
