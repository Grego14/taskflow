import {
  createTheme,
  responsiveFontSizes,
  darken,
  lighten,
  alpha
} from '@mui/material/styles'
import Zoom from '@mui/material/Zoom'

const lightColors = {
  primary: '#7C5DFA',
  secondary: '#A592E8',
  error: '#BA0000'
}

const darkColors = {
  primary: '#A592E8',
  secondary: '#D29AEE',
  error: '#FFA3A3'
}

const baseTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: lightColors.primary,
          contrast: darken(lightColors.primary, 0.25)
        },
        secondary: { main: lightColors.secondary },
        background: {
          app: `
          linear-gradient(
            ${alpha(lightColors.secondary, 0.05)},
            ${alpha(lightColors.primary, 0.15)}),
          linear-gradient(
            225deg, ${alpha('#fff', 0.5)}, 
            ${alpha(lightColors.primary, 0.25)})`,

          drawer: `
          linear-gradient(
            ${alpha(lightColors.secondary, 0.03)},
            ${alpha(lightColors.primary, 0.45)})`,

          appbar: {
            bottom: `linear-gradient(
            ${alpha(lightColors.secondary, 0.03)},
            ${alpha(lightColors.primary, 0.3)})`,

            // the top style matchs with the drawer 
            // (appbar is on top on laptop/desktop devices, when the drawer is
            // temporary)
            top: `linear-gradient(45deg,
            ${alpha(lightColors.secondary, 0.03)},
            ${alpha(lightColors.primary, 0.225)})`
          }
        },
        error: { main: lightColors.error }
      }
    },
    dark: {
      palette: {
        primary: {
          main: darkColors.primary,
          contrast: lighten(darkColors.primary, 0.35)
        },
        secondary: { main: darkColors.secondary },
        background: {
          app: `
          linear-gradient(
            ${alpha(darkColors.secondary, 0.05)},
            ${alpha(darkColors.primary, 0.25)}),
          linear-gradient(
            225deg, ${alpha('#121212', 0.1)}, 
            ${alpha(darkColors.primary, 0.2)})`,

          drawer: `linear-gradient(
              ${alpha(darkColors.secondary, 0.1)},
              ${alpha(darkColors.primary, 0.18)})`,

          appbar: {
            bottom: `linear-gradient(
            ${alpha(darkColors.secondary, 0.03)},
            ${alpha(darkColors.primary, 0.45)})`,

            top: `linear-gradient(45deg,
            ${alpha(darkColors.secondary, 0.1)},
            ${alpha(darkColors.primary, 0.18)})`
          }
        },
        action: {
          selected: 'rgba(255, 255, 255, 0.65)'
        },
        error: { main: darkColors.error }
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
      styleOverrides: {
        '@font-face': {
          fontFamily: 'Rubik',
          src: 'url(/fonts/Rubik-VariableFont_wght.woff2) format("woff2")',
          fontStyle: 'normal',
          fontWeight: '400 700',
          fontDisplay: 'swap'
        },
        body: {
          fontSize: 'inherit'
        },
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0
        }
      }
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
