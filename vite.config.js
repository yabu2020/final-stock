import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // ✅ Proxy ALL backend API endpoints (including :id routes)
      '^/(bread|flour-purchase|baking|sales|expense|report)(/.*)?$': {
        target: 'https://final-stock-backend-1.onrender.com',
                changeOrigin: true,
        // No rewrite — forward as-is
      },
    },
  },
});