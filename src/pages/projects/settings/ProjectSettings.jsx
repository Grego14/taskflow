import { Suspsense, lazy } from 'react'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import ProjectDangerZone from './components/ProjectDangerZone'
import ProjectDescription from './components/ProjectDescription'
import ProjectLabels from './components/ProjectLabels'
import ProjectMembers from './components/ProjectMembers'
import ProjectMetadata from './components/ProjectMetadata'
import ProjectName from './components/ProjectName'
import SaveProject from './components/SaveProject'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProjectSettings() {
  const { t } = useTranslation('ui')
  const { isMobile } = useApp()

  const { data } = useProject()
  const { uid } = useUser()
  const owner = data?.createdBy
  const isArchived = data?.isArchived

  const [name, setName] = useState(data?.name)
  const [description, setDescription] = useState(data?.description)
  const [errors, setErrors] = useState(null)
  const [disableBtn, setDisableBtn] = useState(true)

  useEffect(() => {
    if (errors?.name || errors?.description) setDisableBtn(true)
  }, [errors])

  return (
    <Box
      className='flex flex-column flex-grow'
      p={isMobile ? 4 : 3}
      gap={3}
      maxWidth='35rem'
      mx='auto'>
      {owner !== uid && (
        <Typography variant='body2' color='warning'>
          {t('projects.settings.onlyOwnerCanChange')}
        </Typography>
      )}

      {isArchived && (
        <Typography variant='body2' color='warning'>
          {t('projects.cantUpdateArchived')}
        </Typography>
      )}

      <ProjectName
        name={name}
        setName={setName}
        setErrors={setErrors}
        isOwner={owner === uid}
        isArchived={isArchived}
        setDisableBtn={setDisableBtn}
      />

      <ProjectDescription
        description={description}
        setDescription={setDescription}
        setErrors={setErrors}
        isOwner={owner === uid}
        isArchived={isArchived}
        setDisableBtn={setDisableBtn}
      />
      <ProjectLabels labels={data?.labels} />
      <ProjectMembers />

      <Divider />
      <ProjectMetadata />
      <Divider />

      <ProjectDangerZone isOwner={owner === uid} isArchived={isArchived} />

      <SaveProject
        name={name}
        description={description}
        errors={errors}
        isOwner={owner === uid}
        isArchived={isArchived}
        disableBtn={disableBtn}
        setDisableBtn={setDisableBtn}
      />
    </Box>
  )
}
