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
  const { t } = useTranslation('ui')

  return (
    <Container className='flex flex-column' sx={{ gap: 2.5 }}>
      <SwitcthContainer
        title={t('projects.new.makeTemplate')}
        subtitle={t('projects.new.makeTemplateHelpText')}
        checked={template}
        onCheck={() => {
          setTemplate(prev => {
            const newVal = !prev

            // a template can only be public if the template switch is checked
            if (!newVal) {
              setPublicTemplate(false)
            }

            return newVal
          })
        }}
        icon={<FileCopyIcon fontSize='medium' />}
      />

      <SwitcthContainer
        title={t('projects.new.makeTemplatePublic')}
        subtitle={t('projects.new.makeTemplatePublicHelpText')}
        checked={publicTemplate}
        onCheck={() => setPublicTemplate(prev => !prev)}
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
        <Typography variant='caption' color='textSecondary'>
          {subtitle}
        </Typography>
      </Box>
      <Switch
        checked={checked}
        onChange={onCheck}
        sx={{ ml: 'auto' }}
        disabled={disabled}
      />
    </Box>
  )
}
