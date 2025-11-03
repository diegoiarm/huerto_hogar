import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // --- AÑADE ESTE BLOQUE DENTRO DE defineConfig({ ... }) ---
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setup.js'], // (Este archivo lo crearemos en el Paso 3)
    coverage: {
      provider: 'v8',
      reporter: ['html', 'json', 'text']
    }
  }
  // --- FIN DEL BLOQUE ---
})