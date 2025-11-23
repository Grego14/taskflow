import Slide from '@mui/material/Slide'
import useScrollTrigger from '@mui/material/useScrollTrigger'

export default function HideOnScroll(props) {
  const threshold = props?.threshold || 100
  const disableHysteresis = props?.hysteresis || false

  const trigger = useScrollTrigger({ threshold, disableHysteresis })

  return <Slide in={!trigger}>{props.children}</Slide>
}
