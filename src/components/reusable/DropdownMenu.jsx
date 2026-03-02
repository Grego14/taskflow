import { memo, useState } from 'preact/compat'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import AnimatedMenu from '@components/reusable/animated/AnimatedMenu'

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
    disableTooltip,
    ...other
  } = props

  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl) && !forceClose

  // final cleanup after GSAP finishes
  const handleFinalClose = () => {
    setAnchorEl(null)
    onClose?.()
  }

  const handleOnClick = e => {
    setAnchorEl(e.currentTarget)
    onClick?.(e)
  }

  const tooltipTitle = typeof label === 'function' ? label(isMenuOpen) : label

  const button = !text ? (
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
  )

  return (
    <>
      {!disableTooltip ? (
        <Tooltip title={tooltipTitle} placement={tooltipPosition}>
          <Box component='span' sx={{ display: 'flex' }}>
            {button}
          </Box>
        </Tooltip>
      ) : button}

      <AnimatedMenu open={isMenuOpen} onExitComplete={handleFinalClose}>
        {(renderOpen, setMenuRef, triggerExit) => (
          <Menu
            {...other}
            anchorEl={anchorEl}
            open={renderOpen}
            onClose={triggerExit}
            className={menuClass}
            slotProps={{ transition: null, list: { ref: setMenuRef }, ...other.slotProps }}
            transitionDuration={0}>
            {typeof children === 'function' ? children(triggerExit) : children}
          </Menu>
        )}
      </AnimatedMenu>
    </>
  )
})
