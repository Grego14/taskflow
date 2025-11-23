import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'

import useDebounce from '@hooks/useDebounce'
import { memo, useState } from 'react'

export default memo(function ProjectInput(props) {
  const { id, label, value, setValue, onChange, placeholder, error, ...other } =
    props
  const [localValue, setLocalValue] = useState(value)
  const [debounceChange] = useDebounce(newValue => setValue(newValue), 1000)

  const handleChange = e => {
    const result = onChange(e)

    setLocalValue(e.target.value)

    if (result) {
      debounceChange(e.target.value.trim())
    }
  }

  return (
    <div>
      <InputLabel
        error={!!error}
        htmlFor={id}
        sx={[theme => ({ ...theme.typography.subtitle1, fontWeight: 600 })]}>
        {label}
      </InputLabel>
      <TextField
        size='small'
        id={id}
        fullWidth
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        error={!!error}
        helperText={error}
        spellCheck={false}
        sx={{ mt: 1 }}
        {...other}
      />
    </div>
  )
})
