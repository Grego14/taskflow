import { logOut } from '@/firebase/auth.js'
import Button from '@mui/material/Button'

export default function LogOutButton() {
  return <Button onClick={() => logOut()}>Log Out</Button>
}
