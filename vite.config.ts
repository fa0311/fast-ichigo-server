import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    server: {
    host: '0.0.0.0',
    proxy: {
      '/socket.io/': {
        target: 'http://localhost:8765',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  },
  plugins: [react()],
})
