import GoToProjectIcon from '@mui/icons-material/ChevronRight'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import AppTooltip from '@components/reusable/AppTooltip'
import Typography from '@mui/material/Typography'
import DropdownMenu from '@components/reusable/DropdownMenu'
import Skeleton from '@mui/material/Skeleton'

import { lazy, Suspense } from 'preact/compat'
const ProjectActions = lazy(() => import('./ProjectActions'))

import useAuth from '@hooks/useAuth'
import useNavigateToProject from '@hooks/useNavigateToProject'
import useUser from '@hooks/useUser'
import { useTranslation } from 'react-i18next'
import { useRef } from 'preact/hooks'
import { useGSAP } from '@gsap/react'

import formatTimeAgo from '@utils/formatTimeAgo.js'
import formatTimestamp from '@utils/formatTimestamp.js'
import getMenuLabel from '@utils/getMenuLabel'
import gsap from 'gsap'

const menuSlotProps = {
  list: { className: 'menu-list-slot' },
  paper: { sx: { minWidth: 'auto', minHeight: 'auto' } },
  transition: null
}

const ProjectActionsSkeleton = () => {
  return <Box className='flex flex-column' width='9rem' gap={1.25} py={1.25}>
    <Skeleton height={40} variant='rounded' />
    <Skeleton height={40} variant='rounded' />
  </Box>
}

export default function ProjectCard({ data, isRecent }) {
  const { t } = useTranslation('projects')
  const { uid } = useUser()
  const navigate = useNavigateToProject()
  const { preferences } = useUser()
  const cardRef = useRef(null)

  const { contextSafe } = useGSAP({ scope: cardRef })

  const onHover = contextSafe((active) => {
    gsap.to(cardRef.current, {
      backgroundImage: active ?
        `linear-gradient(rgb(var(--mui-palette-primary-mainChannel) / 0.3), 
        rgb(var(--mui-palette-background-paperChannel) / 0.25))`
        : `linear-gradient(rgb(var(--mui-palette-primary-mainChannel) / 0.05), 
          rgb(var(--mui-palette-background-paperChannel) / 0.05))`,
      duration: 0.5,
      boxShadow: active
        ? '0 10px 20px rgba(0,0,0,0.1)'
        : '0 1px 3px rgba(0,0,0,0.05)',
      borderColor: active ?
        'var(--mui-palette-primary-main)' :
        // keep the border color if the card is recent
        isRecent ? 'var(--mui-palette-primary-main)' : 'transparent',
      overwrite: 'auto'
    })
  })

  const date = formatTimeAgo(
    formatTimestamp(data?.createdAt,
      preferences?.locale)?.raw || new Date(),
    preferences?.locale)

  if (!data || !date) return null

  const noDescription = !data?.description
  const goToProject = t('goToProject')

  const descriptionStyle = {
    '--desc-font-style': noDescription ? 'italic' : 'normal',
    '--desc-color': noDescription ? 'var(--mui-palette-text-secondary)' 
      : 'var(--mui-palette-text-primary)'
  }

  return (
    <Card
      className={`flex flex-column card hide-element project-card ${isRecent ? 'is-recent' : ''}`}
      ref={cardRef}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}>
      <CardHeader
        disableTypography
        action={
          <DropdownMenu
            icon={<MoreVertIcon />}
            label={s => getMenuLabel(s, 'projectCardMenuLabel', 'projects')}
            slotProps={menuSlotProps}>
            <Suspense fallback={<ProjectActionsSkeleton />}>
              <ProjectActions
                id={data?.id}
                archived={data?.isArchived}
                isOwner={data?.createdBy === uid}
                owner={data?.createdBy}
              />
            </Suspense>
          </DropdownMenu>
        }
        title={
          <Typography
            className='project-title hide-element'
            variant='h6'
            fontWeight={700}>
            {data?.name}
          </Typography>
        }
        subheader={
          <Box className='flex project-subheader-box'>
            <Typography
              className='project-id hide-element'
              variant='caption'
              color='textSecondary'>
              {data?.id}
            </Typography>
            {data?.isTemplate &&
              <StatusChip
                label={t('template')}
                color='primary'
              />
            }
            {data?.isArchived &&
              <StatusChip
                label={t('archived')}
                color='warning'
              />
            }
          </Box>
        }
      />
      <CardContent 
        className='flex flex-column project-description'
        style={descriptionStyle}>
        <Typography variant='body1'>
          {data?.description || t('noDescription')}
        </Typography>
      </CardContent >
      <CardActions className='project-actions'>
        <Typography variant='caption' color='textSecondary'>
          {t('created_date', { date })}
        </Typography>

        <AppTooltip title={goToProject} placement='left'>
          <Button
            size='small'
            endIcon={<GoToProjectIcon />}
            onClick={() => navigate(data?.id, data?.createdBy)}>
            <Typography variant='subtitle2' className='go-btn-text'>
              {goToProject}
            </Typography>
          </Button>
        </AppTooltip>
      </CardActions>
    </Card>
  )
}

const StatusChip = ({ label, color }) => (
  <Chip
    label={label}
    size='small'
    variant='outlined'
    className='status-chip'
    style={{ '--chip-color': `var(--mui-palette-${color}-main)` }}
  />
)
