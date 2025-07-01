import { useNavigate } from 'react-router-dom'

export default function SignUpButton() {
  const navigate = useNavigate()

  return (
    <button type='button' onClick={() => navigate('signup')}>
      Sign Up
    </button>
  )
}
