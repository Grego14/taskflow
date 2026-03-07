// components
import GoToProjectIcon from '@mui/icons-material/ChevronRight'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import DropdownMenu from '@components/reusable/DropdownMenu'

import { lazy, Suspense } from 'preact/compat'
const ProjectActions = lazy(() => import('./ProjectActions'))

// hooks
import useAuth from '@hooks/useAuth'
import useNavigateToProject from '@hooks/useNavigateToProject'
import useUser from '@hooks/useUser'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { useRef } from 'preact/hooks'
import { useGSAP } from '@gsap/react'
import useApp from '@hooks/useApp'

// utils
import formatTimeAgo from '@utils/formatTimeAgo.js'
import formatTimestamp from '@utils/formatTimestamp.js'
import getMenuLabel from '@utils/getMenuLabel'
import gsap from 'gsap'

const hidden = { opacity: 0, visibility: 'hidden' }

export default function ProjectCard({ data, isRecent }) {
  const { t } = useTranslation('projects')
  const theme = useTheme()
  const { uid } = useUser()
  const { isMobile } = useApp()
  const navigate = useNavigateToProject()
  const { preferences } = useUser()
  const cardRef = useRef(null)

  const { contextSafe } = useGSAP({ scope: cardRef })

  const onHover = contextSafe((active) => {
    const primaryColor = theme.palette.primary.main

    gsap.to(cardRef.current, {
      backgroundImage: active ?
        `linear-gradient(${theme.alpha(primaryColor, 0.25)}, 
        ${theme.alpha(theme.palette.background.paper, 0.25)})`
        : 'var(--Paper-overlay)',
      duration: 0.5,
      boxShadow: active ? '0 10px 20px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
      borderColor: active ?
        primaryColor :
        // keep the border color if the card is recent
        isRecent ? primaryColor : 'transparent',
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

  return (
    <Card
      className='flex flex-column card'
      ref={cardRef}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      sx={theme => ({
        borderRadius: 2,
        border: isRecent ?
          `1px solid ${theme.palette.primary.main}` :
          '1px solid transparent',
        maxWidth: '35rem',
        ...hidden
      })}>
      <CardHeader
        disableTypography
        action={
          <DropdownMenu
            icon={<MoreVertIcon />}
            label={s => getMenuLabel(s, 'projectCardMenuLabel', 'projects')}
            slotProps={{
              list: { sx: { py: 0 } },
              paper: { sx: { minWidth: 'auto', minHeight: 'auto' } },
              transition: null
            }}>
            <Suspense fallback={null}>
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
            className='project-title'
            sx={{
              ...hidden,
              perspective: '1000px',
              transformOrigin: '0 50% -50'
            }}
            variant='h6'
            fontWeight={700}>
            {data?.name}
          </Typography>
        }
        subheader={
          <Box className='flex' gap={1} mt={0.5} flexWrap='wrap'>
            <Typography
              className='project-id'
              variant='caption'
              sx={{
                ...hidden,
                // align the text with the chips
                lineHeight: 2
              }}
              color='textSecondary'>
              {data?.id}
            </Typography>
            {data?.isTemplate &&
              <StatusChip
                label={t('template')}
                color='primary'
                theme={theme}
                type={preferences?.theme}
              />
            }
            {data?.isArchived &&
              <StatusChip
                label={t('archived')}
                color='warning'
                theme={theme}
              />
            }
          </Box>
        }
      />
      <CardContent className='flex flex-column' sx={{ flexGrow: 1, py: 0 }}>
        <Typography
          className='project-description'
          sx={{
            minHeight: theme.typography.body1.fontSize,
            fontStyle: noDescription ? 'italic' : 'normal',
            color: `text.${noDescription ? 'secondary' : 'primary'}`
          }}>
          {data?.description || t('noDescription')}
        </Typography>
      </CardContent >
      <CardActions sx={{ p: 2, justifyContent: 'space-between', mt: 'auto' }}>
        <Typography variant='caption' color='textSecondary'>
          {t('created_date', { date })}
        </Typography>

        <Tooltip title={goToProject} placement='left'>
          <Button
            size='small'
            endIcon={<GoToProjectIcon />}
            onClick={() => navigate(data?.id, data?.createdBy)}
            aria-label={isMobile ? goToProject : null}
            sx={{
              fontWeight: 700, '& .MuiButton-endIcon': {
                ...(isMobile && { ml: 0, p: 1 })
              }
            }}>
            {!isMobile && goToProject}
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  )
}

const StatusChip = ({ label, color, theme, type }) => (
  <Chip
    label={label}
    size='small'
    variant='outlined'
    sx={{
      fontSize: '0.65rem',
      fontWeight: 900,
      bgcolor: theme.alpha(theme.palette[color].main, 0.08),
      color: theme.palette[color].main,
      border: 'none'
    }}
  />
)
