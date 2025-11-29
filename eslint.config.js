import { config } from '@repo/eslint-config/base';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    ignores: [
      'node_modules/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/generated/**',
      'packages/api-client/src/generated/**',
      'packages/database/generated/**',
    ],
  },
];
