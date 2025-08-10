import { scan } from 'react-scan'
scan({ enabled: true })

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import GlobalStyles from '@mui/material/GlobalStyles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import AppProvider from './context/AppContext'
import { AuthProvider } from './firebase/AuthContext'
import { ThemeProvider, createTheme } from '@mui/material/styles'

history.scrollRestoration = 'manual'

const appGlobalStyles = (
  <GlobalStyles
    styles={{
      body: {
        fontFamily:
          '"Rubik", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
      }
    }}
  />
)

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 'var(--fs-small)',
          textTransform: 'none',
          minWidth: 'auto',
          color: 'var(--dark-gray)'
        },
        contained: {
          backgroundColor: 'var(--police-blue-500)',
          color: 'var(--ghost-white)'
        }
      }
    }
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#54448a'
    },
    secondary: {
      main: '#d06ba7'
    }
  },
  breakpoints: {
    values: {
      mobile: 320,
      tablet: 640,
      laptop: 1024,
      desktop: 1200
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline />
    {appGlobalStyles}

    <ThemeProvider noSsr theme={theme}>
      <AuthProvider>
        <AppProvider>
          <Router>
            <App />
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
