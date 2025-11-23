import Typography from '@mui/material/Typography'

export default function ErrorMessage({ error, className }) {
  return (
    <Typography variant='body2' color='error' className={className}>
      {error}
    </Typography>
  )
}
