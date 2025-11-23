import { cloneElement, useCallback, useMemo } from 'react'
import { useController } from 'react-hook-form'

export default function RegisterComponent(props) {
  const { name, control, rules, handler, component, ...other } = props
  const {
    field,
    formState: { errors }
  } = useController({ name, control, rules })

  const onChange = useCallback(
    e => {
      field.onChange(e.target.value)
      handler?.(e)
    },
    [field.onChange, handler]
  )

  return cloneElement(component, {
    error: errors?.[name],
    field: { ...field, ...other, onChange }
  })
}
