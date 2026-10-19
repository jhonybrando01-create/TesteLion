import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2500, // model-viewer inclui o three.js (bundle grande é normal)
  },
});
