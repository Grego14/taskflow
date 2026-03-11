import { forwardRef } from 'preact/compat'
import Box from '@mui/material/Box'

const ButtonListItem = forwardRef(function ButtonListItem(props, ref) {
  const {
    children,
    component: Button,
    'aria-label':
    label,
    btnProps,
    ...otherProps
  } = props

  return (
    // otherProps can be Tooltip/container props
    <Box component='li' {...otherProps} ref={ref}>
      <Button aria-label={label} {...btnProps}>{children}</Button>
    </Box>
  )
})

export default ButtonListItem
