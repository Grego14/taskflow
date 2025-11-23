import RemoveIcon from '@mui/icons-material/Clear'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export default function LabelsPreview({ actualLabels = [], deleteLabel }) {
  return (
    <Box
      className='flex flex-wrap'
      gap={1.5}
      mt={actualLabels.length > 0 ? 1.5 : 0}>
      {actualLabels.map(label => (
        <Button
          className='task-label'
          px={1.5}
          value={label}
          size='small'
          key={`taskLabel-${label}`}
          endIcon={<RemoveIcon fontSize='small' color='action' />}
          variant='outlined'
          onClick={deleteLabel}
          onKeyUp={deleteLabel}>
          <Typography variant='caption'>{label}</Typography>
        </Button>
      ))}
    </Box>
  )
}
