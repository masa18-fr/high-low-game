import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/high-low-game/', // 👈 GitHub Pagesのサブパス
  plugins: [react()],
})