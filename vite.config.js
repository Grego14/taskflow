import path from 'node:path'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import { visualizer } from "rollup-plugin-visualizer"

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
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/compat/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  },
  build: { target: 'esnext' }
})
