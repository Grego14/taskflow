import path from 'node:path'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import tsconfigPaths from 'vite-tsconfig-paths'
import postcssGlobalData from '@csstools/postcss-global-data';
import postcssCustomMedia from 'postcss-custom-media'

export default defineConfig({
  plugins: [
    preact(),
    visualizer({
      open: true,
      filename: 'preact-stats.html',
      gzipSize: true,
      brotliSize: true
    }),
    tsconfigPaths()
  ],
  css: {
    postcss: {
      plugins: [
        postcssGlobalData({ 
          files: [ './src/styles/global/media-queries.css' ]
        }),
        postcssCustomMedia()
      ]
    }
  },
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, './src/utils'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@services': path.resolve(__dirname, './src/services'),
      '@querys': path.resolve(__dirname, './src/querys'),
      '@context': path.resolve(__dirname, './src/context'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@logic': path.resolve(__dirname, './src/logic'),
      '@test': path.resolve(__dirname, './src/test'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@': path.resolve(__dirname, './src'),
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/compat/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  },
  test: { globals: true, setupFiles: ['./src/test/setup.js'] },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('i18next')) return 'vendor-i18n'
        }
      }
    }
  }
})
