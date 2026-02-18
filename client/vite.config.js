import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: '0.0.0.0',
        strictPort: false,
        allowedHosts: ['.ngrok-free.app', '.ngrok.io', '.ngrok.app', '192.168.3.37', 'localhost', '10.0.2.2'],
        proxy: {
            '/api': {
                target: 'http://localhost:8001',
                changeOrigin: true,
                ws: true,
            },
            '/media': {
                target: 'http://localhost:8001',
                changeOrigin: true,
            },
            '/uploads': {
                target: 'http://localhost:8001',
                changeOrigin: true,
            },
        }
    }
})
