import { defineWorkspace } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: './src/tests.setup.ts',
      name: 'unit',
      include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)']
    }
  },
  {
    extends: './vitest.config.ts',
    test: {
      setupFiles: './tests/tests.setup.ts',
      environment: 'node',
      name: 'integration',
      include: ['./tests/**/*.{test,spec}.?(c|m)[jt]s?(x)']
    }
  }
]);
