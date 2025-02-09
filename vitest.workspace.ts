import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'node',
      include: ['./test/node/**/*.test.ts'],
      environment: 'node',
    },
  },
  {
    test: {
      name: 'jsdom',
      include: ['./test/dom/**/*.test.ts'],
      environment: 'jsdom',
    },
  },
  {
    test: {
      name: 'happy-dom',
      include: ['./test/dom/**/*.test.ts'],
      environment: 'happy-dom',
    },
  },
  // {
  //   test: {
  //     name: 'browser',
  //     include: ['./test/dom/**/*.test.ts'],
  //     browser: {
  //       provider: 'playwright',
  //       enabled: true,
  //       instances: [{ browser: 'chromium' }],
  //     },
  //   },
  // },
]);
