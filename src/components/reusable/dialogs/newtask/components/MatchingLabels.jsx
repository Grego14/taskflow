import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import ClickAwayListener from '@mui/material/ClickAwayListener'

export default function MatchingLabels({
  handleInteraction,
  labels = [],
  showLabels
}) {
  return (
    <ClickAwayListener
      mouseEvent='onMouseDown'
      touchEvent='onTouchStart'
      onClickAway={e => {
        showLabels(false)
      }}>
      <Box
        className='flex flex-wrap'
        onClick={handleInteraction}
        onKeyUp={handleInteraction}
        sx={{
          gap: 1.5,
          py: 2,
          boxShadow: '0 3px 6px 1px rgba(0, 0, 0, 0.3)',
          px: 1.5
        }}>
        {labels.map(label => (
          <Chip
            data-label={label}
            key={`suggested-label-${label}`}
            label={label}
            clickable
          />
        ))}
      </Box>
    </ClickAwayListener>
  )
}
