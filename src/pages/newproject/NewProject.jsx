import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import DescriptionInput from '@components/reusable/projects/DescriptionInput'
import NameInput from '@components/reusable/projects/NameInput'
import AddMembers from '@components/ui/projects/AddMembers'
import CreateProject from './components/CreateProject'
import MakeTemplate from './components/MakeTemplate'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function NewProject() {
  const { t } = useTranslation('ui')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isTemplate, setIsTemplate] = useState(false)
  const [publicTemplate, setPublicTemplate] = useState(false)
  const [members, setMembers] = useState([])

  const [errors, setErrors] = useState(null)

  return (
    <Box className='flex-grow' p={4} pb={3}>
      <Typography variant='h1' sx={[theme => ({ ...theme.typography.h3 })]}>
        {t('projects.createProject')}
      </Typography>

      <Paper
        className='flex flex-column'
        variant='outlined'
        sx={{ p: 3, mt: 4, gap: 3 }}>
        <NameInput
          isOwner={true}
          name={name}
          setName={setName}
          setErrors={setErrors}
        />
        <DescriptionInput
          isOwner={true}
          description={description}
          setDescription={setDescription}
          setErrors={setErrors}
        />
        <MakeTemplate
          setTemplate={setIsTemplate}
          template={isTemplate}
          publicTemplate={publicTemplate}
          setPublicTemplate={setPublicTemplate}
        />

        <Divider sx={{ borderBottomWidth: '2px' }} />

        <AddMembers members={members} setMembers={setMembers} />
      </Paper>

      <CreateProject
        name={name}
        description={description}
        isTemplate={isTemplate}
        publicTemplate={publicTemplate}
        members={members}
        errors={errors}
      />
    </Box>
  )
}
