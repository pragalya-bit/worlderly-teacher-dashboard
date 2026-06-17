import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone Worlderly Coach (teacher) dashboard — plain React + Vite.
// Tailwind, Quicksand and Font Awesome are loaded via CDN in index.html so the
// whole thing runs with just `npm install && npm run dev`, no build config.
export default defineConfig({
  plugins: [react()],
  server: { port: 5174, open: true },
})
