import path from 'node:path'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    preact(),
    visualizer({
      open: true,
      filename: 'preact-stats.html',
      gzipSize: true,
      brotliSize: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@services': path.resolve(__dirname, './src/services'),
      '@querys': path.resolve(__dirname, './src/querys'),
      '@context': path.resolve(__dirname, './src/context'),
      '@constants': path.resolve(__dirname, './src/constants'),
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/compat/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('i18next')) return 'vendor-i18n'

          // styles engine, theme system and emotion
          if (
            id.includes('@mui/system') ||
            id.includes('@mui/material/styles') ||
            id.includes('@emotion/styled') ||
            id.includes('@emotion/react')
          ) return 'vendor-mui-system'

          // extract GSAP basics to use on the landing
          if (/node_modules\/gsap\/(index|gsap-core|CSSPlugin|SplitText)/.test(id))
            return 'gsap-landing'

          if (id.includes('node_modules/gsap/')) return 'gsap-app-extras'

          if (id.includes('@mui/material')) {
            // (Card, CardHeader, CardContent, etc.)
            if (id.includes('Card') || id.includes('Paper'))
              return 'ui-cards'

            // (List, ListItem, ListItemText, etc.)
            if (id.includes('List'))
              return 'ui-lists'

            // Buttons
            if (id.includes('Button') || id.includes('IconButton'))
              return 'ui-buttons'

            // Form elements (TextField, Select)
            if (
              id.includes('Input') ||
              id.includes('TextField') ||
              id.includes('Select')) {
              return 'ui-form-elements'
            }

            const sharedComponents = [
              'Box',
              'Typography',
              'Container',
              'Avatar',
              'Tooltip'
            ]

            if (sharedComponents.some(comp => id.includes(comp))) {
              return 'mui-shared-essentials'
            }
          }

          if (id.includes('src/pages/landing')) {
            if (id.includes('MainText'))
              return 'landing-main-content'

            if (id.includes('Cards'))
              return 'landing-cards-section'

            if (id.includes('LoginSection'))
              return 'landing-login-section'

            return 'landing-common'
          }
        }
      }
    }
  }
})
