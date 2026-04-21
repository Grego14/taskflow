import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import FileCopyIcon from '@mui/icons-material/FileCopy'
import PeopleIcon from '@mui/icons-material/People'

import { useTranslation } from 'react-i18next'

const containerStyles = {
  gap: { xs: 3, tablet: 2.5 },
  px: { xs: 0, tablet: 2 }
}

const getSwitchContainerStyles = (t) => ({
  width: 'fit-content',
  p: 1,
  mr: 2,
  backgroundColor: 'transparent',
  backgroundImage: `linear-gradient(-45deg,
    ${t.alpha(t.palette.secondary.main, 0.075)},
    ${t.alpha(t.palette.primary.main, 0.5)})`,
  transition: 'scale 0.2s ease-out',
  '&:hover': { scale: 0.9 }
})

export default function MakeTemplate({
  template,
  setTemplate,
  publicTemplate,
  setPublicTemplate
}) {
  const { t } = useTranslation('projects')

  return (
    <Container
      className='flex flex-column'
      sx={containerStyles}>
      <SwitcthContainer
        title={t('newProject.makeTemplate')}
        subtitle={t('newProject.makeTemplateHelpText')}
        checked={template}
        onCheck={() => {
          const newVal = !template

          setTemplate(newVal)

          if (!newVal) {
            // a template can only be public if the template switch is checked
            setPublicTemplate(false)
          }
        }}
        icon={<FileCopyIcon fontSize='medium' />}
      />

      <SwitcthContainer
        title={t('newProject.makeTemplatePublic')}
        subtitle={t('newProject.makeTemplatePublicHelpText')}
        checked={publicTemplate}
        onCheck={() => setPublicTemplate(!publicTemplate)}
        icon={<PeopleIcon fontSize='medium' />}
        disabled={!template}
      />
    </Container>
  )
}

function SwitcthContainer({
  title,
  subtitle,
  checked,
  onCheck,
  icon,
  disabled
}) {
  return (
    <div className='flex flex-center'>
      <Paper
        className='flex flex-center'
        elevation={2}
        sx={getSwitchContainerStyles}>
        {icon}
      </Paper>

      <div>
        <Typography variant='body2' fontWeight={600}>
          {title}
        </Typography>
        <Typography
          variant='caption'
          color='textSecondary'>
          {subtitle}
        </Typography>
      </div>

      <Switch
        aria-label={title}
        checked={checked}
        onChange={onCheck}
        sx={{ ml: 'auto' }}
        disabled={disabled}
      />
    </div>
  )
}
