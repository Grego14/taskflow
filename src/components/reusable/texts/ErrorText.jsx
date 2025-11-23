import Typography from '@mui/material/Typography'

export default function ErrorText(props) {
  const { children, ...other } = props

  return (
    <Typography variant='h5' {...other}>
      {children}
    </Typography>
  )
}
