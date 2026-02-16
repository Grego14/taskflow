import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import useDebounce from '@hooks/useDebounce'
import { useState, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

const PasswordInput = forwardRef((props, ref) => {
  const { name, onChange, ...other } = props

  const [showPassword, setShowPassword] = useState(false)
  const [value, setValue] = useState('')
  const [debounceOnChange] = useDebounce(e => onChange(e), 750)
  const { t } = useTranslation('auth')

  const handleClickShowPassword = e => setShowPassword(show => !show)

  const handleOnChange = e => {
    const newValue = e.target.value
    setValue(newValue)

    debounceOnChange(e)
  }

  return (
    <TextField
      id={`${name}-label`}
      name={name}
      fullWidth
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
      {...other}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={handleOnChange}
      inputRef={ref}
    />
  )
})

export default PasswordInput
