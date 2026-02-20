import useUser from '@hooks/useUser'
import Button from '@mui/material/Button'
import lazyImport from '@utils/lazyImport'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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
  const { t } = useTranslation('ui')

  return (
    <Button
      endIcon={null}
      sx={{ mt: 2, ml: 'auto', ...sx }}
      variant='contained'
      onClick={async () => {
        const createProject = await lazyImport('/src/services/createProject')

        const projectId = await createProject(uid, {
          isTemplate,
          isPublicTemplate: publicTemplate,
          members: members?.map(member => member.id),
          name,
          description
        })

        navigate(`/projects/${uid}/${projectId}`, {
          state: {
            o: uid
          }
        })
      }}
      // the only required field for a project is the name
      disabled={
        errors?.name || errors?.description || !name || name?.length < 3
      }
      {...other}
    >
      {t('projects.new.create')}
    </Button>
  )
}
