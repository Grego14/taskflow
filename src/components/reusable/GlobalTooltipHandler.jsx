import { useEffect } from 'preact/hooks'
import { 
  tooltipTarget, 
  tooltipOpen, 
  tooltipTitle,
  tooltipIsWarm,
  tooltipProps
} from '@stores/ui'

import '@styles/components/globalTooltip.css'

const WARM_TIMEOUT_MS = 250
const DEFAULT_PROPS = {
  placement: 'top',
  enterDelay: 150,
  enterTouchDelay: 0,
  leaveTouchDelay: 1500
}

let openTimeoutId = null
let warmTimeoutId = null

export default function GlobalTooltipHandler() {
  useEffect(() => {
    let openTimeout = null

    const handleOpen = (e) => {
      // find the closest element with a tooltip attribute
      const target = e.target.closest('[data-tooltip]')

      if (!target) {
        if (tooltipTarget.peek() !== null) {
          tooltipTarget.value = null
          tooltipOpen.value = false
          tooltipTitle.value = null
        }
        return
      }

      const title = target.getAttribute('data-tooltip')
      const placement = target.getAttribute('data-tooltip-placement') || 'top'
      
      const alreadyOpen = tooltipOpen.peek()
      const actualTarget = tooltipTarget.peek()
      const isWarm = tooltipIsWarm.peek()

      if (openTimeoutId) clearTimeout(openTimeoutId)
      if (warmTimeoutId) clearTimeout(warmTimeoutId)

      // if tooltip is already open for this target, do nothing
      if (actualTarget === target && alreadyOpen) return

      const showInstant = isWarm || alreadyOpen

      const updateState = () => {
        tooltipTarget.value = target || null
        tooltipTitle.value = title
        tooltipOpen.value = true
        tooltipIsWarm.value = true
        tooltipProps.value = { ...DEFAULT_PROPS, placement }
      }

      openTimeoutId = setTimeout(updateState, showInstant 
        ? 0
        : DEFAULT_PROPS.enterDelay)
    }

    const handleClose = (e) => {
      const target = e.target?.closest?.('[data-tooltip]')

      if (!target) {
        if (tooltipTarget.peek() !== null) {
          tooltipTarget.value = null
          tooltipOpen.value = false
          tooltipTitle.value = null
        }
        return
      }

      // check if the element the user is moving to is still inside the same 
      // tooltip target
      const related = e.relatedTarget
      if (related && target.contains(related)) return

      if (openTimeoutId) clearTimeout(openTimeoutId)

      if (tooltipOpen.peek()) {
        tooltipOpen.value = false
        tooltipTarget.value = null
        tooltipTitle.value = null
      }

      if (warmTimeoutId) clearTimeout(warmTimeoutId)

      warmTimeoutId = setTimeout(() => {
        tooltipIsWarm.value = false
      }, WARM_TIMEOUT_MS)
    }

    const handleClick = (e) => {
      const target = e.target.closest('[data-tooltip]')

      if(target){
        tooltipTarget.value = null
        tooltipTitle.value = null
        tooltipTitle.open = false
      }
    }

    document.addEventListener('mouseover', handleOpen)
    document.addEventListener('mouseout', handleClose)
    document.addEventListener('focusin', handleOpen)
    document.addEventListener('focusout', handleClose)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('mouseover', handleOpen)
      document.removeEventListener('mouseout', handleClose)
      document.removeEventListener('focusin', handleOpen)
      document.removeEventListener('focusout', handleClose)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}
