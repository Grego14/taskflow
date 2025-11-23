import Link from '@mui/material/Link'
import { forwardRef } from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'

export default function NavLink(props) {
  return <Link component={RouterNavLink} {...props} />
}
