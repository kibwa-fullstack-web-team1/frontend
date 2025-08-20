import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 현재 작업 디렉토리의 .env 파일을 기반으로 환경 변수를 로드합니다.
  // 세 번째 인자 ''는 'VITE_' 접두사가 없는 변수도 모두 로드합니다.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: [env.MAIN_DOMAIN],
      proxy: {
        // 기존 /api 프록시는 그대로 둡니다.
        '/api': {
          target: env.VITE_DAILY_QUESTION_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        // reward-service를 위한 프록시를 올바르게 설정합니다.
        '/reward-api': {
          target: env.VITE_REWARD_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/reward-api/, '/api/v1'),
        },
        // notification-service를 위한 프록시 설정
        '/notifications-api': {
          target: env.VITE_NOTIFICATION_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/notifications-api/, ''),
        },
        // user-service (인증)를 위한 프록시 설정 추가
        '/auth': {
          target: env.VITE_AUTH_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth/, '/auth'),
        },
        // memory-flip-card-service를 위한 프록시 설정 추가
        '/memory-flip-card-api': {
          target: env.VITE_CARD_GAME_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/memory-flip-card-api/, ''),
          headers: {
            'Accept': 'application/json'
          }
        },
        // story-sequencer-service를 위한 프록시 설정 추가
        '/story-sequencer-api': {
          target: env.VITE_STORY_SEQUENCER_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/story-sequencer-api/, ''),
        },
        // daily-question-service를 위한 프록시 설정 추가
        '/questions': {
          target: env.VITE_DAILY_QUESTION_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  };
});