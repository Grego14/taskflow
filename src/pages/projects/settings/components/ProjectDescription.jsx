import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ProjectInput from './ProjectInput.jsx'

import validateProjectField from '@utils/projects/validateProjectField'

export default function ProjectDescription({
  description,
  setDescription,
  setErrors,
  isOwner,
  isArchived,
  setDisableBtn
}) {
  const { t } = useTranslation('projects')
  const [error, setError] = useState('')

  const handleValidation = (e) => {
    const { hasError, errorMsg } = validateProjectField(e.target.value, {
      t,
      type: 'description'
    })

    setError(errorMsg)
    setErrors(prev => ({ ...prev, name: hasError }))

    if (!hasError) setDisableBtn(false)

    return !hasError
  }

  return (
    <ProjectInput
      id='project-description'
      label={t('inputs.descriptionLabel')}
      value={description}
      setValue={setDescription}
      onChange={handleValidation}
      placeholder={t('inputs.descriptionPlaceholder')}
      error={error}
      multiline
      rows={5}
      disabled={isArchived || !isOwner}
    />
  )
}
