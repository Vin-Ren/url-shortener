import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/s/': {
        target: 'http://127.0.0.1:8585',
        changeOrigin: true,
      },
      '/api/': {
        target: 'http://127.0.0.1:8585',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
