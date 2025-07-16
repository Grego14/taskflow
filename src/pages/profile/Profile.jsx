import { useAppState } from '@/context/AppContext'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'

export default function Profile() {
  const { user, loading } = useAppState()
  const navigate = useNavigate()

  return loading ? (
    <div>Fetching user data...</div>
  ) : (
    <div>
      {user.profile && user.preferences && (
        <ul>
          <li>Username: {user.profile.username}</li>
          <li>Email: {user.profile.email}</li>
          <li>Language: {user.preferences.lang}</li>
          <li>Theme: {user.preferences.theme}</li>
        </ul>
      )}
      <Button onClick={() => navigate('/')}>Go home</Button>
    </div>
  )
}
