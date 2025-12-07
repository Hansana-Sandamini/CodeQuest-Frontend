import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),       
  ],
  server: {
    port: 5173,
    proxy: {
      // This magically forwards all /api/v1 calls to backend
      "/api/v1": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
