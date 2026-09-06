import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: /trig-trainer/
export default defineConfig({
  plugins: [react()],
  base: '/trig-trainer/',
})
