import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    exclude: ['node_modules', 'e2e', '.next', '.git'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    env: {
      NEXT_PUBLIC_API_URL: 'https://laravel-backend-api.up.railway.app',
      NEXT_PUBLIC_APP_URL: 'https://bondkonnect.up.railway.app',
      NEXT_PUBLIC_PUSHER_APP_CLUSTER: 'eu',
      NEXT_PUBLIC_PUSHER_APP_KEY: '8b6fde671de8467f0bd2',
    },
  },
})