import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves project sites from /<repo-name>/, so the build needs
  // to know its base path to resolve assets correctly. Falls back to "/" for
  // local dev and other hosts (Vercel, Netlify) that serve from the domain root.
  base: process.env.GITHUB_PAGES === 'true' ? '/Weatherle/' : '/',
  plugins: [react()],
})
