import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import FileCopyIcon from '@mui/icons-material/FileCopy'
import PeopleIcon from '@mui/icons-material/People'

import { useTranslation } from 'react-i18next'

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
      sx={{
        gap: { xs: 1.25, tablet: 2.5 },
        px: { xs: 0, tablet: 2 }
      }}>
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
    <Box className='flex flex-center' gap={2}>
      <Paper
        className='flex flex-center'
        elevation={2}
        sx={{ width: 'fit-content', p: 1 }}>
        {icon}
      </Paper>

      <Box>
        <Typography variant='body2' fontWeight={600}>
          {title}
        </Typography>
        <Typography
          variant='caption'
          color='textSecondary'
          sx={[theme => ({ lineHeight: 1.25 })]}>
          {subtitle}
        </Typography>
      </Box>
      <Switch
        aria-label={title}
        checked={checked}
        onChange={onCheck}
        sx={{ ml: 'auto' }}
        disabled={disabled}
      />
    </Box>
  )
}
