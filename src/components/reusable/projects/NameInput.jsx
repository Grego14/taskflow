import Input from './Input.jsx'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProjectName({ name, setName, setErrors, isOwner }) {
  const { t } = useTranslation('ui')
  const [error, setError] = useState('')

  const validateName = e => {
    const newName = e.target.value.trim()
    const isEmpty = !newName
    const isInvalid = !/^[a-zA-Z0-9!@#$()[\]{}<>~:"';.,/\\=+_\-*\s]+$/.test(
      newName
    )

    if (isEmpty) {
      setError(t('projects.inputs.errors.nameIsEmpty'))
    }

    if (isInvalid && !error) {
      setError(t('projects.inputs.errors.nameIsInvalid'))
    }

    if (isEmpty || isInvalid) {
      setErrors(prev => ({ ...prev, name: true }))
      return false
    }

    setError('')
    setErrors(prev => ({ ...prev, name: false }))
    return true
  }

  return (
    <Input
      id='project-name'
      label={t('projects.inputs.nameLabel')}
      placeholder={t('projects.inputs.namePlaceholder')}
      error={error}
      value={name}
      setValue={setName}
      onChange={validateName}
      disabled={!isOwner}
    />
  )
}
