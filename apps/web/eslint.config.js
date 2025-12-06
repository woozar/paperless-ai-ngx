import { nextJsConfig } from '@repo/eslint-config/next-js';
import nodeImport from 'eslint-plugin-node-import';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    plugins: {
      ...nextJsConfig.plugins,
      'node-import': nodeImport,
    },
    rules: {
      ...nextJsConfig.rules,
      'node-import/prefer-node-protocol': 2,
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'test-utils/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
