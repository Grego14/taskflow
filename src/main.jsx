if (import.meta.env.DEV) {
  const { scan } = await import('react-scan')

  scan({ enabled: true })
}

import { forwardRef } from 'react'
import { createRoot } from 'react-dom/client'

import Slide from '@mui/material/Slide'
import Zoom from '@mui/material/Zoom'

import { StrictMode } from 'react'
import AppProvider from '@context/AppContext'
import AuthProvider from '@context/AuthContext'
import { I18nextProvider } from 'react-i18next'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import i18n from './i18n.js'

import { createTheme, responsiveFontSizes } from '@mui/material/styles'

import RubikBold from '/fonts/Rubik-Bold.woff2'
import RubikMedium from '/fonts/Rubik-Medium.woff2'
import RubikRegular from '/fonts/Rubik-Regular.woff2'
import './main.css'

history.scrollRestoration = 'manual'

const DialogTransition = forwardRef(function DialogTransition(props, ref) {
  return <Slide direction='right' ref={ref} {...props} />
})

const theme = responsiveFontSizes(
  createTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#54448A'
          },
          secondary: {
            main: '#B97BD8'
          }
        }
      },
      dark: {
        palette: {
          primary: {
            main: '#A592E8'
          },
          secondary: {
            main: '#D29AEE'
          }
        }
      }
    },
    typography: {
      fontFamily: 'Rubik, Arial, sans-serif'
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme, ...props }) => {
            const defaultTransition = theme.transitions.create(
              [
                'background-color',
                'box-shadow',
                'border-color',
                'color',
                'scale'
              ],
              {
                duration: theme.transitions.duration.short
              }
            )

            return {
              fontSize: 'var(--fs-small)',
              textTransform: 'none',
              minWidth: 'auto',
              transition: defaultTransition,
              '& .MuiButton-icon': { transition: 'inherit' },
              // add a cool press effect
              '&:active, &:active .MuiButton-icon': {
                scale: 0.95
              }
            }
          }
        }
      },
      MuiTooltip: {
        defaultProps: {
          slots: { transition: Zoom },
          arrow: true,
          enterDelay: 350
        }
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            // remove the margin at the sides so the helper text can be
            // aligned with the input
            marginInline: 0
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: ({ theme, ...props }) => {
            const { color, ownerState } = props
            const providedColor = color || ownerState.color

            return {
              color: providedColor || theme.palette.primary.main
            }
          }
        }
      },
      MuiCssBaseline: {
        styleOverrides: `
        @font-face {
          font-family: 'Rubik';
          src: local(Rubik), local(Rubik-Regular), url(${RubikRegular}) format('woff2');
          font-style: normal;
          font-weight: 400;
          font-display: swap;
        }
        @font-face {
          font-family: 'Rubik';
          src: local(Rubik-Medium), url(${RubikMedium}) format('woff2');
          font-style: normal;
          font-weight: 500;
          font-display: swap;
        }
        @font-face {
          font-family: 'Rubik';
          src: local(Rubik-Bold), url(${RubikBold}) format('woff2');
          font-style: normal;
          font-weight: 700;
          font-display: swap;
        }
        body{
          font-size: inherit;
        }
      `
      },
      MuiDialog: {
        defaultProps: {
          slots: {
            transition: DialogTransition
          }
        }
      },
      MUITypography: {
        styleOverrides: {
          root: {
            fontFamily: 'Rubik, Arial, sans-serif'
          }
        }
      }
    },
    breakpoints: {
      values: {
        mobile: 420,
        tablet: 640,
        laptop: 1024,
        desktop: 1360
      }
    }
  }),
  {
    breakpoints: ['mobile', 'tablet', 'laptop', 'desktop']
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider noSsr theme={theme}>
      <CssBaseline />
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <AppProvider />
        </AuthProvider>
      </I18nextProvider>
    </ThemeProvider>
  </StrictMode>
)
