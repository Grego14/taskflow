import useUser from '@hooks/useUser'
import Button from '@mui/material/Button'
import lazyImport from '@utils/lazyImport'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import projectService from 'src/services/project'

// errors field only manages the errors of the name and description values
export default function CreateProject({
  name,
  description,
  isTemplate,
  publicTemplate,
  members,
  errors,
  sx,
  ...other
}) {
  const navigate = useNavigate()
  const { uid } = useUser()
  const { t } = useTranslation('projects')

  // the only required field for a project is the name
  const isDisabled = errors?.name || !name || name?.length < 3

  return (
    <Button
      endIcon={null}
      sx={{ mt: 2, ml: 'auto', ...sx }}
      variant='contained'
      onClick={async () => {
        const projectId = await projectService.createProject(uid, {
          isTemplate,
          isPublicTemplate: publicTemplate,
          members: members?.map(member => member.id),
          name,
          description
        })

        navigate(`/projects/${uid}/${projectId}`)
      }}
      disabled={isDisabled}
      {...other}>
      {t('new.create')}
    </Button>
  )
}
