import { render } from 'preact'
import AppProvider from '@context/AppContext'
import AuthProvider from '@context/AuthContext'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { StrictMode, useEffect, Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n.js'
import { theme } from './theme.js'

history.scrollRestoration = 'manual'

render(
  <StrictMode>
    <Suspense fallback={null}>
      <ThemeProvider noSsr theme={theme}>
        <CssBaseline />
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <AppProvider />
          </AuthProvider>
        </I18nextProvider>
      </ThemeProvider>
    </Suspense>
  </StrictMode>,
  document.getElementById('root')
)
