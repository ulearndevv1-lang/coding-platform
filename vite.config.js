import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Optional: only when you run the API on another port (e.g. `vercel dev` on 3000 while using `vite` on 5173).
  const apiProxyTarget =
    env.CODESPACE_DEV_API_PROXY || env.VITE_DEV_API_PROXY || ''

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['pyodide'],
    },
    server: apiProxyTarget
      ? {
          proxy: {
            '/api': {
              target: apiProxyTarget.replace(/\/$/, ''),
              changeOrigin: true,
            },
          },
        }
      : {},
  }
})
