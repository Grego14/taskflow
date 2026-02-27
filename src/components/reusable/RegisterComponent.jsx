import { useController } from 'react-hook-form'

export default function RegisterComponent(props) {
  const { name,
    control,
    rules,
    handler,
    component: Component,
    props: componentProps,
    ...other
  } = props

  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error }
  } = useController({ name, control, rules })

  const handleChange = (e) => {
    const val = e?.target ? e.target.value : e
    onChange(val)
    handler?.(e)
  }


  return (
    <Component
      {...componentProps}
      {...other}
      name={name}
      value={value ?? ''}
      onChange={handleChange}
      onBlur={onBlur}
      inputRef={ref}
      error={!!error}
      helperText={error?.message}
    />
  )
}
