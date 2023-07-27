import esbuild from 'esbuild';
import { PluginInlineWorker } from './plugin-inline-worker.mjs';

esbuild.build({
  entryPoints: ['libs/vm/src/index.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node18',
  outdir: 'dist/vm/',
  outExtension: {
    '.js': '.mjs'
  },

  plugins: [PluginInlineWorker({
    format: 'cjs',
    minify: false,
  })],
});
