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

import useAuth from '@hooks/useAuth'
import useNavigateToProject from '@hooks/useNavigateToProject'
import useUser from '@hooks/useUser'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { useRef } from 'preact/hooks'
import { useGSAP } from '@gsap/react'

import formatTimeAgo from '@utils/formatTimeAgo.js'
import formatTimestamp from '@utils/formatTimestamp.js'
import getMenuLabel from '@utils/getMenuLabel'
import gsap from 'gsap'

const menuSlotProps = {
  list: { sx: { py: 0 } },
  paper: { sx: { minWidth: 'auto', minHeight: 'auto' } },
  transition: null
}

const idStyles = { lineHeight: 2 } // align the text with the chips
const titleStyles = { perspective: '1000px', transformOrigin: '0 50% -50' }

const goBtnTextStyles = { display: { xs: 'none', tablet: 'block' } }
const goBtnStyles = {
  fontWeight: 700, 
  '& .MuiButton-endIcon': { ml: { xs: 0, tablet: 1 }, p: { xs: 1, tablet: 0 } }
}

const cardContentStyles = { flexGrow: 1, py: 0 }
const actionsStyles = { p: 2, justifyContent: 'space-between', mt: 'auto' }

export default function ProjectCard({ data, isRecent }) {
  const { t } = useTranslation('projects')
  const theme = useTheme()
  const { uid } = useUser()
  const navigate = useNavigateToProject()
  const { preferences } = useUser()
  const cardRef = useRef(null)

  const { contextSafe } = useGSAP({ scope: cardRef })

  const onHover = contextSafe((active) => {
    const primaryColor = theme.palette.primary.main

    gsap.to(cardRef.current, {
      backgroundImage: active ?
        `linear-gradient(${theme.alpha(primaryColor, 0.3)}, 
        ${theme.alpha(theme.palette.background.paper, 0.25)})`
        : `linear-gradient(${theme.alpha(primaryColor, 0.05)}, 
        ${theme.alpha(theme.palette.background.paper, 0.05)})`,
      duration: 0.5,
      boxShadow: active
        ? '0 10px 20px rgba(0,0,0,0.1)'
        : '0 1px 3px rgba(0,0,0,0.05)',
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
        backgroundColor: 'transparent',
        borderRadius: 2,
        border: isRecent ?
          `1px solid ${theme.palette.primary.main}` :
          '1px solid transparent',
        maxWidth: '35rem',
        transition: 'none'
      })}>
      <CardHeader
        disableTypography
        action={
          <DropdownMenu
            icon={<MoreVertIcon />}
            label={s => getMenuLabel(s, 'projectCardMenuLabel', 'projects')}
            slotProps={menuSlotProps}>
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
            className='project-title hide-element'
            sx={titleStyles}
            variant='h6'
            fontWeight={700}>
            {data?.name}
          </Typography>
        }
        subheader={
          <Box className='flex' gap={1} mt={0.5} flexWrap='wrap'>
            <Typography
              className='project-id hide-element'
              variant='caption'
              sx={idStyles}
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
      <CardContent className='flex flex-column' sx={cardContentStyles}>
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
      <CardActions sx={actionsStyles}>
        <Typography variant='caption' color='textSecondary'>
          {t('created_date', { date })}
        </Typography>

        <Tooltip title={goToProject} placement='left'>
          <Button
            size='small'
            endIcon={<GoToProjectIcon />}
            onClick={() => navigate(data?.id, data?.createdBy)}
            sx={goBtnStyles}>
            <Typography 
              variant='subtitle2'
              sx={goBtnTextStyles}>
              {goToProject}
            </Typography>
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
