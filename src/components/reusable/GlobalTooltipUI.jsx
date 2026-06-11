import Popper from '@mui/material/Popper'
import Paper from '@mui/material/Paper'
import Grow from '@mui/material/Grow'

import { 
  tooltipIsWarm,
  tooltipProps,
  tooltipOpen,
  tooltipTitle,
  tooltipTarget
} from '@stores/ui'

const modifiers = [
  { name: 'offset', options: { offset: [0, 8] } },
  { name: 'preventOverflow', options: { padding: 8 } }
]

const origins = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
}

export default function GlobalTooltipUI() {
  const open = tooltipOpen.value
  const title = tooltipTitle.value
  const target = tooltipTarget.value
  const props = tooltipProps.value
  const isWarm = tooltipIsWarm.value

  return target ? (
    <Popper
      open={open}
      anchorEl={target}
      placement={props.placement}
      transition
      className='app-popper'
      modifiers={modifiers}>
      {({ TransitionProps, placement }) => {
        return (
          <Grow 
            {...TransitionProps} 
            timeout={isWarm ? 50 : 200}
            style={{
              transformOrigin: `center ${origins[placement] || 'top'}`,
              transitionTimingFunction: isWarm 
                ? 'cubic-bezier(0, 0, 0.2, 1)' 
                : 'ease-out'
            }}>
            <Paper className='app-tooltip' elevation={0}>
              {title}
            </Paper>
          </Grow>
        )}}
    </Popper>
  ) : null
}
