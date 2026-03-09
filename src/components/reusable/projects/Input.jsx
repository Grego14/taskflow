import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'

import useDebounce from '@hooks/useDebounce'
import { memo, useState } from 'react'

export default memo(function ProjectInput(props) {
  const {
    id,
    label,
    value,
    setValue,
    onChange,
    placeholder,
    error,
    shrink,
    fullWidth = false,
    ...other
  } = props

  const [localValue, setLocalValue] = useState(value)
  const [debounceChange] = useDebounce(newValue => setValue(newValue), 750)

  const handleChange = e => {
    const result = onChange(e)

    setLocalValue(e.target.value)

    if (result) {
      debounceChange(e.target.value.trim())
    }
  }

  return (
    <TextField
      label={label}
      size='small'
      id={id}
      fullWidth={fullWidth}
      slotProps={{ inputLabel: { shrink } }}
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      error={!!error}
      helperText={error}
      spellCheck={false}
      sx={{ mt: 1 }}
      {...other}
    />
  )
})
