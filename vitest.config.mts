// import { defineConfig } from 'vitest/config'
// import react from '@vitejs/plugin-react'
// import tsconfigPaths from 'vite-tsconfig-paths'
 
// export default defineConfig({
//   plugins: [tsconfigPaths(), react()],
//   test: {
//     environment: 'jsdom',
//   },
// })

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js',
        '*.config.ts',
        'src/generated/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});