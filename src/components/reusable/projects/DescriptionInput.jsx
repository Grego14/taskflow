import Input from './Input.jsx'

import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default memo(function ProjectDescription({
  description,
  setDescription,
  setErrors,
  isOwner
}) {
  const { t } = useTranslation('projects')
  const [error, setError] = useState('')

  const validateDescription = e => {
    const value = e.target.value.trim()

    if (!/^[a-zA-Z0-9!@#$()[\]{}<>~:"';.,/\\=+_\-*\s]+$/.test(value)) {
      setError(t('inputs.errors.descriptionIsInvalid'))
      setErrors(prev => ({ ...prev, description: true }))
      return false
    }

    setError('')
    setErrors(prev => ({ ...prev, description: false }))
    return true
  }

  return (
    <Input
      id='project-description'
      label={t('inputs.descriptionLabel')}
      value={description}
      setValue={setDescription}
      onChange={validateDescription}
      placeholder={t('inputs.descriptionPlaceholder')}
      error={error}
      multiline
      rows={5}
      disabled={!isOwner}
    />
  )
})
