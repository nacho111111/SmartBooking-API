import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'octagon-labrador-owl.ngrok-free.dev' // Agrega aquí tu dominio de ngrok
      
    ]
  }
})
