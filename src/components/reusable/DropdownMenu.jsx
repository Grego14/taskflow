import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import { memo, useEffect, useRef, useState } from 'react'

export default memo(function DropdownMenu(props) {
  const {
    children,
    onClick,
    onClose,
    icon,
    label,
    buttonStyles,
    menuClass,
    tooltipPosition = 'left',
    text,
    forceClose,
    disabled,
    ...other
  } = props

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleOnClose = () => {
    setAnchorEl(null)
    onClose?.()
  }

  const handleOnClick = e => {
    setAnchorEl(e.currentTarget)
    onClick?.(e)
  }

  return (
    <>
      <Tooltip
        title={typeof label === 'function' ? label?.(open) : label}
        placement={tooltipPosition}>
        {/* the tooltip needs the span if the button is disabled */}
        <span className='flex'>
          {!text ? (
            <IconButton
              sx={buttonStyles}
              onClick={handleOnClick}
              disabled={disabled}>
              {icon}
            </IconButton>
          ) : (
            <Button
              sx={buttonStyles}
              onClick={handleOnClick}
              startIcon={icon}
              disabled={disabled}>
              {text}
            </Button>
          )}
        </span>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={forceClose ? false : open}
        onClose={handleOnClose}
        className={menuClass}
        {...other}>
        {children}
      </Menu>
    </>
  )
})
