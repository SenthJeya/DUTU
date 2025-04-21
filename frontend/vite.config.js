import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://dutu-app-api.vercel.app/api', // Change this to your backend server's address and port
        changeOrigin: true, // Ensures the Origin header is correctly set
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional, to strip `/api` from the forwarded request
      },
    },
  },
})