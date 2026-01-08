import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import useDebounce from '@hooks/useDebounce'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AuthPasswordInput({ field, error }) {
  const [showPassword, setShowPassword] = useState(false)
  const [value, setValue] = useState('')
  const [debounceOnChange] = useDebounce(e => field.onChange(e), 750)
  const { t } = useTranslation('auth')

  const handleClickShowPassword = () => setShowPassword(show => !show)

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
      type={showPassword ? 'text' : field.type}
      placeholder={t(
        // use the same placeholder for the repeatedPassword
        `inputs.placeholders.${field.name === 'repeatedPassword' ? 'password' : field.name}`,
        { ns: 'auth' }
      )}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label={t(
                  `inputs.${showPassword ? 'hidePassword' : 'showPassword'}`
                )}
                onClick={handleClickShowPassword}
                onMouseDown={e => e.preventDefault()}
                edge='end'>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }
      }}
      onChange={handleOnChange}
      onBlur={field.onBlur}
      error={!!error}
      inputRef={field.ref}
      autoComplete={field.autoComplete}
      helperText={error?.message}
    />
  )
}
