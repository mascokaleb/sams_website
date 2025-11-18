import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const projectId = env.VITE_SANITY_PROJECT_ID;

  return {
    base: './',
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: projectId
        ? {
            '/sanity-proxy': {
              target: `https://${projectId}.apicdn.sanity.io`,
              changeOrigin: true,
              secure: true,
              rewrite: (path) => path.replace(/^\/sanity-proxy/, ''),
            },
          }
        : undefined,
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(rootDir, 'index.html'),
          tournaments: resolve(rootDir, 'tournament-highlights.html'),
          videos: resolve(rootDir, 'video-highlights.html'),
          gallery: resolve(rootDir, 'gallery.html'),
        },
      },
    },
  };
});
