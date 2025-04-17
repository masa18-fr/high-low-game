// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/high-low-game/',  // ★ GitHubリポジトリ名をここに設定！
  plugins: [react()],
})