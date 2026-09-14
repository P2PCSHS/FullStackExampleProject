import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // During local development, forward /api/* to the Flask server so the
    // browser sees a single origin and CORS never gets in the way.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
