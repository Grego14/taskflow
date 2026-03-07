import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import ProjectDangerZone from './components/ProjectDangerZone'
import ProjectDescription from './components/ProjectDescription'
import ProjectMembers from './components/ProjectMembers'
import ProjectMetadata from './components/ProjectMetadata'
import ProjectName from './components/ProjectName'
import SaveProject from './components/SaveProject'

import useApp from '@hooks/useApp'
import useProject from '@hooks/useProject'
import useUser from '@hooks/useUser'
import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const BOX_STYLING = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  width: '100%',
  maxWidth: 'tablet',
  mx: 'auto'
}

export default function ProjectSettings() {
  const { t } = useTranslation('projects')
  const { isMobile } = useApp()
  const { data } = useProject()
  const { uid } = useUser()

  const settingsRef = useRef(null)

  const owner = data?.createdBy
  const isArchived = data?.isArchived
  const isOwner = owner === uid
  const canEdit = isOwner && !isArchived

  const [name, setName] = useState(data?.name)
  const [description, setDescription] = useState(data?.description)
  const [errors, setErrors] = useState(null)
  const [disableBtn, setDisableBtn] = useState(true)

  useGSAP(() => {
    gsap.to(settingsRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.75,
      ease: 'back.out(2)',
      delay: 0.1
    })
  }, { scope: settingsRef })

  useEffect(() => {
    if (data) {
      setName(data.name)
      setDescription(data.description)
    }
  }, [data])

  useEffect(() => {
    const hasErrors = errors?.name || errors?.description
    if (hasErrors) setDisableBtn(true)
  }, [errors])

  const commonProps = {
    isOwner,
    isArchived,
    setErrors,
    setDisableBtn
  }

  return (
    <Box
      ref={settingsRef}
      sx={{
        ...BOX_STYLING,
        transform: 'translateX(-30px)',
        opacity: 0
      }}
      p={isMobile ? 4 : 3}
      gap={3}>
      {!isOwner && (
        <Typography variant='body2' color='orange' className='font-medium'>
          {t('settings.onlyOwnerCanChange')}
        </Typography>
      )}

      {isArchived && (
        <Typography variant='body2' color='orange' className='font-medium'>
          {t('cantUpdateArchived')}
        </Typography>
      )}

      <ProjectName
        name={name}
        setName={setName}
        {...commonProps}
      />

      <ProjectDescription
        description={description}
        setDescription={setDescription}
        {...commonProps}
      />

      <ProjectMembers />

      <Divider />
      <ProjectMetadata />
      <Divider />

      <ProjectDangerZone isOwner={isOwner} isArchived={isArchived} />

      <SaveProject
        name={name}
        description={description}
        errors={errors}
        disableBtn={disableBtn}
        setDisableBtn={setDisableBtn}
        isOwner={isOwner}
        isArchived={isArchived}
      />
    </Box>
  )
}
