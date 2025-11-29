// components
import DropdownMenu from '@components/reusable/DropdownMenu'
import GoToProjectIcon from '@mui/icons-material/ChevronRight'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import ProjectActions from './ProjectActions'

// hooks
import useAuth from '@hooks/useAuth'
import useNavigateToProject from '@hooks/useNavigateToProject'
import useUser from '@hooks/useUser'
import { alpha, useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

// utils
import formatTimeAgo from '@utils/formatTimeAgo.js'
import formatTimestamp from '@utils/formatTimestamp.js'
import getMenuLabel from '@utils/getMenuLabel'

export default function ProjectCard({ data }) {
  const { currentUser } = useAuth()
  const { t } = useTranslation('ui')
  const theme = useTheme()
  const navigate = useNavigateToProject()
  const { preferences } = useUser()

  const locale = preferences?.locale

  // format the firebase timestamp ({seconds, nanoseconds}) to a Date object
  const createdDate = data?.createdAt
    ? formatTimestamp(data?.createdAt, locale)?.raw
    : new Date()
  const date = formatTimeAgo(createdDate, locale)

  if (!data) return null

  return (
    <Card
      data-id={data?.id}
      className='flex flex-column'
      sx={{ maxWidth: '30rem' }}>
      <CardHeader
        disableTypography
        action={
          <DropdownMenu
            icon={<MoreVertIcon />}
            label={state =>
              getMenuLabel(state, 'projects.projectCardMenuLabel', 'ui')
            }>
            <ProjectActions
              id={data?.id}
              archived={data?.isArchived}
              isOwner={data?.createdBy === currentUser?.uid}
              owner={data?.createdBy}
            />
          </DropdownMenu>
        }
        title={
          <Typography variant='h3' sx={[theme => ({ ...theme.typography.h6 })]}>
            {data?.name}
          </Typography>
        }
        subheader={
          <Box className='flex' gap={2} mt={1}>
            <Typography>{data?.id}</Typography>
            {data?.isTemplate && (
              <Chip
                variant='outlined'
                label={t('projects.template')}
                color='primary'
                sx={{
                  ...theme.typography.caption,
                  fontWeight: 'bold',
                  backgroundColor: alpha(
                    theme.palette.primary[preferences?.theme],
                    0.1
                  )
                }}
                size='small'
              />
            )}

            {data?.isArchived && (
              <Chip
                variant='outlined'
                label={t('projects.archived')}
                color='warning'
                sx={{
                  ...theme.typography.caption,
                  fontWeight: 'bold',
                  backgroundColor: alpha(theme.palette.warning.main, 0.1)
                }}
                size='small'
              />
            )}
          </Box>
        }
      />
      <CardContent
        className='flex flex-column'
        sx={{ py: 0, height: '100%', gap: 1 }}>
        <Typography>{data?.description}</Typography>
        <Box
          className='flex'
          sx={{
            mt: 'auto',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            my: 0.75
          }}>
          <Typography color='textSecondary' variant='body2'>
            {t('projects.created_date', { date })}
          </Typography>
          {data?.members?.length > 0 && (
            <Typography color='textSecondary' variant='body2'>
              {t('projects.members', { count: data?.members?.length })}
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions
        className='flex'
        sx={{ justifyContent: 'space-between', py: 2 }}>
        <Button
          endIcon={<GoToProjectIcon fontSize='small' />}
          onClick={() => navigate(data?.id, data?.createdBy)}>
          {t('projects.goToProject')}
        </Button>
      </CardActions>
    </Card>
  )
}
