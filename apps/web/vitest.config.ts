import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e', 'components/ui'],
    env: {
      LOG_LEVEL: 'none',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        '.next/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.config.js',
        '**/config.ts',
        '**/config.js',
        '**/vitest.setup.ts',
        '**/locales/**',
        '**/test-utils/**',
        '**/_components/index.ts',
        '**/lib/api/schemas/index.ts', // Barrel export with side-effects only
        '**/lib/scheduler/index.ts', // Barrel export only (re-exports)
        '**/instrumentation.ts',
        '**/route-wrapper/types.ts', // Only TypeScript types, no runtime code
        '**/components/ui/**', // shadcn components - tested through integration
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
