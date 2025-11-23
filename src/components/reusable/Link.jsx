import MuiLink from '@mui/material/Link'
import { forwardRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'

const LinkBehavior = forwardRef((props, ref) => (
  <RouterLink ref={ref} {...props} />
))

export default function Link(props) {
  const { children, className, ...other } = props

  return (
    <MuiLink {...other} component={LinkBehavior} className={className}>
      {children}
    </MuiLink>
  )
}
