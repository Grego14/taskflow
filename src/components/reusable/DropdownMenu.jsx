import { memo, useState } from 'preact/compat'
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
    tooltipPosition = 'left',
    text,
    forceClose,
    disabled,
    disableTooltip,
    asListItem = false,
    slots = {},
    slotProps = {},
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

  const RootButton = slots.root || (!text ? IconButton : Button)
  const TooltipComponent = slots.tooltip || Tooltip
  
  const tooltipTitle = typeof label === 'function' ? label(isMenuOpen) : label
  const buttonContent = text || icon

  const rootProps = {
    disabled,
    onClick: handleOnClick,
    startIcon: text ? icon : null,
    children: asListItem ? null : buttonContent,
    ...slotProps.root
  }

  const menuProps = {
    ...other,
    anchorEl,
    open: isMenuOpen,
    autoFocusItem: true,
    transitionDuration: 0,
    ...slotProps.menu,
    slotProps: {
      backdrop: {
        sx: { bgcolor: 'rgba(0,0,0,0.3)' },
        ...slotProps.menu?.slotProps?.backdrop
      },
      list: {
        sx: { overflow: 'hidden' },
        ...slotProps.menu?.slotProps?.list
      }
    }
  }

  const renderButton = () => {
    const trigger = asListItem ? (
      <ButtonListItem 
        component={RootButton} 
        btnProps={rootProps} 
        children={buttonContent} 
      />
    ) : (
        <RootButton {...rootProps} />
      )

    if (disableTooltip) return trigger

    return (
      <TooltipComponent 
        title={tooltipTitle} 
        placement={tooltipPosition} 
        {...slotProps.tooltip}>
        {trigger}
      </TooltipComponent>
    )
  }

  return (
    <>
      {renderButton()}

      <AnimatedMenu open={isMenuOpen} onExitComplete={handleFinalClose}>
        {(renderOpen, setMenuRef, triggerExit) => (
          <Menu
            {...menuProps}
            open={renderOpen}
            onClose={triggerExit}
            ref={setMenuRef}>
            {typeof children === 'function'
              ? children(renderOpen, triggerExit)
              : children}
          </Menu>
        )}
      </AnimatedMenu>
    </>
  )
})
