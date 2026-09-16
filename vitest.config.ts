import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react({ include: /\.(tsx|ts)$/ })],
    resolve: {
        alias: {
            '@': resolve(import.meta.dirname, 'src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        include: ['tests/**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            include: ['src/**'],
            exclude: ['src/main.tsx', resolve(import.meta.dirname, 'posts/**')],
            thresholds: { statements: 50, branches: 50, functions: 50, lines: 50 },
        },
    },
});
