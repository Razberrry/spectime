import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), ...(command === 'build' ? [cssInjectedByJsPlugin()] : [])],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Spectime',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'spectime.es.js' : 'spectime.cjs'),
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'chronon-timeline', 'clsx', 'jotai', 'date-fns'],
      output: {
        exports: 'named',
      },
    },
  },
}));
