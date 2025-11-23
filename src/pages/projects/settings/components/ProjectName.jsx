import ProjectInput from './ProjectInput.jsx'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProjectName({
  name,
  setName,
  setErrors,
  isOwner,
  isArchived,
  setDisableBtn
}) {
  const { t } = useTranslation('ui')
  const [error, setError] = useState('')

  const validateName = e => {
    const newName = e.target.value.trim()
    const isEmpty = !newName
    const isInvalid = !/^[a-zA-Z0-9!@#$()[\]{}<>~:"';.,/\\=+_\-*\s]+$/.test(
      newName
    )

    if (isEmpty) setError(t('projects.inputs.errors.nameIsEmpty'))
    if (isInvalid) setError(t('projects.inputs.errors.nameIsInvalid'))

    if (isEmpty || isInvalid) {
      setErrors(prev => ({ ...prev, name: true }))
      return false
    }

    setError('')
    setErrors(prev => ({ ...prev, name: false }))
    setDisableBtn(false)
    return true
  }

  return (
    <ProjectInput
      id='project-name'
      label={t('projects.inputs.nameLabel')}
      error={error}
      value={name}
      setValue={setName}
      onChange={validateName}
      disabled={isArchived || !isOwner}
    />
  )
}
