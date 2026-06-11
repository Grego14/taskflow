import { cloneElement } from 'preact'

export default function AppTooltip({ children, title, placement = 'top' }) {
  if (!title) return children

  // inject data attributes to be captured by the global listener
  return cloneElement(children, {
    'data-tooltip': title,
    'data-tooltip-placement': placement
  })
}
