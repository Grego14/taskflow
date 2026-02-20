import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProjectInput from './ProjectInput.jsx'

import validateProjectField from '@utils/projects/validateProjectField'

export default function ProjectName({
  name,
  setName,
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
      type: 'name',
      isRequired: true
    })

    setError(errorMsg)
    setErrors(prev => ({ ...prev, name: hasError }))

    if (!hasError) setDisableBtn(false)

    return !hasError
  }

  return (
    <ProjectInput
      id='project-name'
      label={t('inputs.nameLabel')}
      error={error}
      value={name}
      setValue={setName}
      onChange={handleValidation}
      disabled={isArchived || !isOwner}
    />
  )
}
