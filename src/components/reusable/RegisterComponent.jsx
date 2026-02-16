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
    field,
    formState: { errors }
  } = useController({ name, control, rules })

  const onChange = e => {
    field.onChange(e.target.value)
    handler?.(e)
  }

  return (
    <Component
      {...field}
      {...componentProps}
      {...other}
      error={!!errors?.[name]}
      helperText={errors?.[name]?.message}
      onChange={onChange}
    />
  )
}
