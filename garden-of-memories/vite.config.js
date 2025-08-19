import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', 
    port: 5173,
    allowedHosts: ['kibwa-1team-alb-1678050163.ap-southeast-1.elb.amazonaws.com', 'www.hwichan.shop'],
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
      // user-service (인증)를 위한 프록시 설정 추가
      '/auth': {
        target: process.env.VITE_AUTH_API_BASE_URL, // user-service에 접근
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, '/auth'), // 백엔드도 /auth로 시작하므로 그대로 유지
      },
      // memory-flip-card-service를 위한 프록시 설정 추가
      '/memory-flip-card-api': {
        target: 'http://100.74.13.49:8020', // memory-flip-card-service에 접근
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/memory-flip-card-api/, ''),
      },
      // 스토리 시퀀서 서비스 (story-sequencer)를 위한 프록시 설정 추가
      '/story-sequencer-api': {
        target: process.env.VITE_STORY_SEQUENCER_API_BASE_URL, // story-sequencer-service에 접근
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/story-sequencer-api/, ''),
      },
    },
  },
})
