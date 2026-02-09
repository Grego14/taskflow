import Link from '@mui/material/Link'
import { forwardRef } from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'

const NavLink = forwardRef((props, ref) => {
  return <Link component={RouterNavLink} {...props} ref={ref} />
})

export default NavLink
