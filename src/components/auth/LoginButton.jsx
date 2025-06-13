import navigate from '@utils/navigate'

export default function LoginButton() {
  return <button onClick={() => navigate('/login')}>Login</button>
}
