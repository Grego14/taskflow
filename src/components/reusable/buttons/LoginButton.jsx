import { useNavigate } from 'react-router-dom'

export default function LoginButton() {
  const navigate = useNavigate()

  return (
    <button type='button' onClick={() => navigate('/login')}>
      Login
    </button>
  )
}
