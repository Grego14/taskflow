import {
  createTheme,
  responsiveFontSizes,
  darken,
  lighten
} from '@mui/material/styles'
import { grey } from '@mui/material/colors'
import Zoom from '@mui/material/Zoom'
import { APPBAR_HEIGHT } from './constants'

// same breakpoints used on the vite postcss config
export const BREAKPOINTS = {
  xs: 0,
  mobile: 420,
  tablet: 640,
  laptop: 1024,
  desktop: 1360
}

const TASK_MENU_WIDTH = '12rem'

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

const LANDING_TITLE_GRADIENT = `linear-gradient(
  90deg, 
  var(--mui-palette-primary-main) 0%, 
  var(--mui-palette-secondary-main) 35%, 
  var(--mui-palette-primary-light) 50%, 
  var(--mui-palette-secondary-main) 65%, 
  var(--mui-palette-primary-main))`

const baseTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class'
  },
  ui: {
    taskCardMaxWidth: '27.5rem'
  },
  zIndex: {
    zenOverlay: 12000,
    // used on floating elements inside the zenOverlay (minimize btn tooltip,
    // drawer)
    zenPriority: 13000,
    globalAlert: 14000 
  },
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
              rgba(var(--mui-palette-secondary-mainChannel) / 0.05),
              rgba(var(--mui-palette-primary-mainChannel) / 0.15)
            ),
            linear-gradient(
              225deg, 
              rgba(255 255 255 / 0.5), 
              rgba(var(--mui-palette-primary-mainChannel) / 0.25))`,

          drawer: `linear-gradient(
            rgba(var(--mui-palette-secondary-mainChannel) / 0.03),
            rgba(var(--mui-palette-primary-mainChannel) / 0.45))`,

          // the top style matchs with the drawer 
          // (appbar is on top on laptop/desktop devices, when the drawer is
          // temporary)
          appbarTop: `linear-gradient(45deg, 
            rgba(var(--mui-palette-secondary-mainChannel) / 0.03), 
            rgba(var(--mui-palette-primary-mainChannel) / 0.225))`,

          appbarBottom: `linear-gradient(
            rgba(var(--mui-palette-secondary-mainChannel) / 0.03), 
            rgba(var(--mui-palette-primary-mainChannel) / 0.3))`,

          profile: `
            radial-gradient(
            at 0% 0%, 
            rgba(var(--mui-palette-secondary-mainChannel) / 0.25) 0px, 
            transparent 60%),
            radial-gradient(
            at 100% 100%, 
            rgba(var(--mui-palette-primary-mainChannel) / 0.15) 0px, 
            transparent 60%),
            #fff`,

          landingMainBlur: `
            radial-gradient(
            at 0% 0%, 
            rgba(var(--mui-palette-primary-mainChannel) / 0.35) 0px, 
            transparent 50%),
            radial-gradient(
            at 100% 0%, 
            rgba(var(--mui-palette-secondary-mainChannel) / 0.4) 0px, 
            transparent 50%)`,

          landingMainTitle: LANDING_TITLE_GRADIENT
        },
        error: { main: lightColors.error },
        shadows: {
          drawer: {
            solo: `0 0 1px rgba(var(--mui-palette-primary-mainChannel) / 0.1), 
              4px 0 12px -3px rgba(var(--mui-palette-primary-mainChannel) / 0.08)`,
            withAppbar: `0 ${APPBAR_HEIGHT.other} 15px -5px rgba(0, 0, 0, 0.1)`
          },
          appbar: `0 2px 10px -3px rgba(var(--mui-palette-primary-mainChannel) / 0.1)`
        }
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
              rgba(var(--mui-palette-secondary-mainChannel) / 0.05),
              rgba(var(--mui-palette-primary-mainChannel) / 0.25)
            ),
            linear-gradient(
              225deg, 
              rgba(18 18 18 / 0.1), 
              rgba(var(--mui-palette-primary-mainChannel) / 0.2)
            )
            var(--mui-palette-background-default)`,

          drawer: `linear-gradient(
            rgba(var(--mui-palette-secondary-mainChannel) / 0.1),
            rgba(var(--mui-palette-primary-mainChannel) / 0.18))`,
          
          appbarTop: `linear-gradient(45deg, 
            rgba(var(--mui-palette-secondary-mainChannel) / 0.1), 
            rgba(var(--mui-palette-primary-mainChannel) / 0.18))`,

          appbarBottom: `linear-gradient(
            rgba(var(--mui-palette-secondary-mainChannel) / 0.03), 
            rgba(var(--mui-palette-primary-mainChannel) / 0.45))`,

          profile: `
            radial-gradient(
            at 0% 0%, 
            rgba(var(--mui-palette-secondary-mainChannel) / 0.3) 0px, 
            transparent 50%),
            radial-gradient(
            at 100% 0%, 
            rgba(var(--mui-palette-primary-mainChannel) / 0.2) 0px, 
            transparent 50%),
            #121212`,

          landingMainBlur: `
            radial-gradient(
            at 0% 0%, 
            rgba(var(--mui-palette-primary-mainChannel) / 0.35) 0px, 
            transparent 50%),
            radial-gradient(
            at 100% 0%, 
            rgba(var(--mui-palette-secondary-mainChannel) / 0.3) 0px, 
            transparent 50%)`,

          landingMainTitle: LANDING_TITLE_GRADIENT
        },
        action: {
          selected: 'rgba(255, 255, 255, 0.65)'
        },
        error: { main: darkColors.error },
        shadows: {
          drawer: {
            solo: `0 0 2px rgba(0, 0, 0, 0.5), 8px 0 20px -10px rgba(0, 0, 0, 0.8)`,
            withAppbar: `0 ${APPBAR_HEIGHT.other} 20px -8px rgba(0, 0, 0, 0.9)`
          },
          appbar: `0 4px 12px -5px rgba(0, 0, 0, 0.8)`
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
        // slots: { transition: Zoom },
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
            color: providedColor || 'var(--mui-palette-primary-main)'
          }
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--mui-transitions-duration-standard': '0.3s',
          '--mui-transitions-duration-shorter': '0.2s',
          '--mui-transitions-duration-shortest': '0.15s',
          '--mui-transitions-duration-complex': '0.375s',

          '--mui-transitions-easing-easeInOut': 'cubic-bezier(0.4, 0, 0.2, 1)',
          '--mui-transitions-easing-easeOut': 'cubic-bezier(0, 0, 0.2, 1)',

          '--appbar-height-mobile': APPBAR_HEIGHT.mobile,
          '--appbar-height-other': APPBAR_HEIGHT.other,
          '--laptop-bp': `${BREAKPOINTS.laptop}px`
        },
        '@font-face': {
          fontFamily: 'Rubik',
          src: 'url(/fonts/Rubik-VariableFont_wght.woff2) format("woff2")',
          fontStyle: 'normal',
          fontWeight: '400 900',
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
        },
        // used on animated elements (improves animations on lazy-loaded
        // components)
        '.hide-element': {
          opacity: 0,
          visibility: 'hidden'
        },
        '.task-menu-paper': {
          maxWidth: `${TASK_MENU_WIDTH} !important`,
          width: '100%'
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
  breakpoints: { values: BREAKPOINTS }
})

export const theme = responsiveFontSizes(baseTheme, {
  breakpoints: Object.keys(BREAKPOINTS)
})
