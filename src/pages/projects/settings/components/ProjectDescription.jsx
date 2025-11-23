import ProjectInput from './ProjectInput.jsx'

import useDebounce from '@hooks/useDebounce'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProjectDescription({
  description,
  setDescription,
  setErrors,
  isOwner,
  isArchived,
  setDisableBtn
}) {
  const { t } = useTranslation('ui')
  const [error, setError] = useState('')

  const validateDescription = e => {
    const value = e.target.value.trim()

    if (!/^[a-zA-Z0-9!@#$()[\]{}<>~:"';.,/\\=+_\-*\s]+$/.test(value)) {
      setError(t('projects.inputs.errors.descriptionIsInvalid'))
      setErrors(prev => ({ ...prev, description: true }))
      return false
    }

    setError('')
    setErrors(prev => ({ ...prev, description: false }))
    setDisableBtn(false)
    return true
  }

  return (
    <ProjectInput
      id='project-description'
      label={t('projects.inputs.descriptionLabel')}
      value={description}
      setValue={setDescription}
      onChange={validateDescription}
      placeholder={t('projects.inputs.descriptionPlaceholder')}
      error={error}
      multiline
      rows={5}
      disabled={isArchived || !isOwner}
    />
  )
}
