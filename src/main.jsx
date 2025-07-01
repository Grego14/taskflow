import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import { AuthProvider } from './firebase/AuthContext'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </StrictMode>
)
