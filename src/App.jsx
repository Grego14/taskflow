import { createContext, useContext, useRef, useState } from 'react'
import { useAuth } from './firebase/AuthContext'
import './App.css'
import AppRoutes from './AppRoutes.jsx'

const AppContext = createContext({
  lang: localStorage.getItem('lang') || 'en',
  theme: localStorage.getItem('theme') || 'light'
})

export default function App() {
  const { isOffline, currentUser } = useAuth()
  const [lang, setLang] = useState('en')

  return <AppRoutes />
}

export function useUser() {
  return useContext(AppContext)
}
