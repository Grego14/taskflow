import TextField from '@mui/material/TextField'

import useDebounce from '@hooks/useDebounce'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AuthInput({ field, error }) {
  const { t } = useTranslation('auth')
  const [value, setValue] = useState('')
  const [debounceOnChange] = useDebounce(e => field.onChange(e), 750)

  const handleOnChange = e => {
    const newValue = e.target.value
    setValue(newValue)

    debounceOnChange(e)
  }

  return (
    <TextField
      id={`${field.name}-label`}
      fullWidth
      name={field.name}
      label={t(`inputs.labels.${field.name}`, { ns: 'auth' })}
      value={value}
      type={field.type || 'text'}
      placeholder={t(
        // use the same placeholder for the repeatedPassword
        `inputs.placeholders.${field.name === 'repeatedPassword' ? 'password' : field.name}`,
        { ns: 'auth' }
      )}
      onChange={handleOnChange}
      onBlur={field.onBlur}
      error={!!error}
      inputRef={field.ref}
      autoComplete={field.autoComplete}
      helperText={error?.message}
    />
  )
}
