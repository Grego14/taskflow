import TextField from '@mui/material/TextField'

import useDebounce from '@hooks/useDebounce'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AuthInput(props) {
  const { ref, onChange, name, ...other } = props
  const { t } = useTranslation('auth')
  const [value, setValue] = useState('')
  const [debounceOnChange] = useDebounce(e => onChange(e), 750)

  const handleOnChange = e => {
    const newValue = e.target.value
    setValue(newValue)

    debounceOnChange(e)
  }

  return (
    <TextField
      {...other}
      id={`${name}-label`}
      fullWidth
      name={name}
      label={t(`inputs.labels.${name}`, { ns: 'auth' })}
      value={value}
      placeholder={t(
        // use the same placeholder for the repeatedPassword
        `inputs.placeholders.${name === 'repeatedPassword' ? 'password' : name}`,
        { ns: 'auth' }
      )}
      onChange={handleOnChange}
      inputRef={ref}
    />
  )
}
