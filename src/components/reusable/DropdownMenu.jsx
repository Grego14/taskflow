import { memo, useState, forwardRef } from 'preact/compat'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import AnimatedMenu from '@components/reusable/animated/AnimatedMenu'
import ButtonListItem from './buttons/ButtonListItem'

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
    asListItem = false,
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
  const { button: btnSlotProps, ...otherSlots } = other?.slotProps || {}

  const buttonContent = !text ? icon : text
  const buttonProps = {
    sx: buttonStyles,
    onClick: handleOnClick,
    disabled,
    startIcon: !text ? null : icon,
    children: asListItem ? null : buttonContent,
    ...btnSlotProps
  }

  const DropdownButton = !text ? IconButton : Button

  return (
    <>
      {!disableTooltip ? (
        <Tooltip title={tooltipTitle} placement={tooltipPosition}>
          {asListItem
            ? <ButtonListItem
              component={DropdownButton}
              btnProps={buttonProps}
              children={buttonContent}
            />
            : <DropdownButton {...buttonProps} />}
        </Tooltip>
      ) : <DropdownButton {...buttonProps} />}

      <AnimatedMenu open={isMenuOpen} onExitComplete={handleFinalClose}>
        {(renderOpen, setMenuRef, triggerExit) => (
          <Menu
            {...other}
            anchorEl={anchorEl}
            open={renderOpen}
            onClose={triggerExit}
            className={menuClass}
            autoFocusItem
            ref={setMenuRef}
            slotProps={{
              transition: null,
              list: {
                sx: {
                  overflow: 'hidden',
                  ...otherSlots?.list?.sx
                }
              },
              backdrop: {
                sx: { bgcolor: 'rgba(0,0,0,0.3)' },
                onClick: triggerExit
              },
              ...otherSlots
            }}
            transitionDuration={0}>
            {typeof children === 'function'
              ? children(renderOpen, triggerExit)
              : children}
          </Menu>
        )}
      </AnimatedMenu>
    </>
  )
})
