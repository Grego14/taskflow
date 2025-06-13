import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import { AuthProvider } from './firebase/AuthContext'
import App from './App'

history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
