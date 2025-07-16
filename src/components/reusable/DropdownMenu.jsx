import MenuClosedIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import { Button, Menu, MenuItem, Box } from '@mui/material'
import { Children, useEffect, useRef, useState, useMemo } from 'react'

/**
 * @component - Customizable dropdown menu
 * @param {Object} props - Component props
 * @param {ReactNode|ReactNode[]} props.children - Menu items to be displayed in the dropdown
 * @param {ReactNode} [props.iconClosed] - Custom icon to display when menu is closed
 * @param {ReactNode} [props.iconOpen] - Custom icon to display when menu is open
 * @param {Object} [props.menuItemStyles] - Styles to apply to menu items (MUI sx prop)
 * @param {Function} [props.onClick] - Callback function when button is clicked
 * @param {Function} [props.onClose] - Callback function when menu is closed
 * @param {Function} [props.label] - Function that returns aria-label text based on menu state
 * @param {string} [props.text] - Text that will be showed along with the button
 * @param {string} [props.className] - Additional class name for the Menu component
 * @returns {ReactElement} A dropdown menu component
 * 
*/
export default function DropdownMenu({
  children,
  iconClosed,
  iconOpen,
  menuItemStyles,
  onClick,
  onClose,
  label,
  text,
  className
}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const hasCustomIcons = iconClosed && iconOpen

  useEffect(() => {
    if (!open && onClose) onClose()
  }, [open, onClose])

  const menuItems = Children.map(children, child => (
    <MenuItem sx={menuItemStyles}>{child}</MenuItem>
  ))

  function handleButtonClick(e) {
    setAnchorEl(e.currentTarget)

    if (onClick) onClick()
  }

  const closedIcon = useMemo(
    () => (hasCustomIcons && iconClosed ? iconClosed : <MenuClosedIcon fontSize='large' />),
    [iconClosed, hasCustomIcons]
  )
  const openIcon = useMemo(
    () => (hasCustomIcons && iconOpen ? iconOpen : <MenuOpenIcon fontSize='large' />),
    [iconOpen, hasCustomIcons]
  )

  return (
    menuItems?.length && (
      <>
        <Button onClick={handleButtonClick} aria-label={label?.(open)} sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '.2rem',
          fontSize: '.65rem',
          maxWidth: '5rem'
        }}>
          {open ? openIcon : closedIcon}
          {text && text}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          className={className}>
          {menuItems}
        </Menu>
      </>
    )
  )
}
