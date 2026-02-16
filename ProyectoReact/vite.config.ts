import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // ✅ SOLUCIÓN SIMPLE: Solo cambiar el minificador
    minify: 'terser',
  },
})