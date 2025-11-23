import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

export default function OptionalSelector({
  defaultOption,
  handler,
  label,
  defaultOptionDisabled = true,
  children,
  value = '',
  title,
  labelId,
  sx
}) {
  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{title}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={label}
        sx={[
          theme => ({
            ...sx,
            '& .MuiSelect-select': {
              fontSize: theme.typography.body2.fontSize,
              color:
                value === defaultOption ? theme.palette.action.disabled : null,
              ...sx?.['& .MuiSelect-select']
            }
          })
        ]}
        onChange={handler}>
        {children}
      </Select>
    </FormControl>
  )
}
