import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// Resolve @my-ds/ui to its source so component edits hot-reload without a build.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@my-ds/ui': fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)) },
    dedupe: ['react', 'react-dom'],
  },
});
