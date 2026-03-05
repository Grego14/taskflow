import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import Zoom from '@mui/material/Zoom'

const baseTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#7C5DFA'
        },
        secondary: {
          main: '#A592E8'
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
          src: url(/fonts/Rubik-VariableFont_wght.woff2) format('woff2');
          font-style: normal;
          font-weight: 400 700;
          font-display: swap;
        }
        body{
          font-size: inherit;
        }
      `
    },
    MUITypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Rubik, Arial, sans-serif'
        }
      }
    },
    MuiAvatar: {
      defaultProps: {
        slotProps: {
          img: {
            referrerPolicy: 'no-referrer',
            crossOrigin: 'anonymous'
          }
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      mobile: 420,
      tablet: 640,
      laptop: 1024,
      desktop: 1360
    }
  }
})

export const theme = responsiveFontSizes(baseTheme, {
  breakpoints: ['mobile', 'tablet', 'laptop', 'desktop']
})
