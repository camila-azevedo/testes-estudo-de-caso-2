import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// O proxy faz o navegador falar só com localhost:5173. Assim o cookie do
// refresh token fica na mesma origem do front e não há problema de CORS.
const backend = 'http://localhost:8080'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': backend,
      '/oauth2': backend,
      '/login': backend,
    },
  },
})
