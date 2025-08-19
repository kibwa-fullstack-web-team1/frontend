import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // 기존 /api 프록시는 그대로 둡니다.
      '/api': {
        target: process.env.VITE_DAILY_QUESTION_API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // reward-service를 위한 프록시를 올바르게 설정합니다.
      '/reward-api': {
        target: process.env.VITE_REWARD_API_BASE_URL, // EC2 내부에서 reward-service에 접근
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/reward-api/, '/api/v1'),
      },
      // notification-service를 위한 프록시 설정
      '/notifications-api': {
        target: process.env.VITE_NOTIFICATION_API_BASE_URL, // notification-service에 접근
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/notifications-api/, ''),
      },
    },
  },
})
