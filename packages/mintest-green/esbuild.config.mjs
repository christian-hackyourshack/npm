import esbuild from 'esbuild';

// Automatically exclude all node_modules from the bundled version
import { nodeExternalsPlugin } from 'esbuild-node-externals';

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    minify: true,
    platform: 'node',
    target: 'node14',
    sourcemap: true,
    plugins: [nodeExternalsPlugin()],
  })
  .catch(() => process.exit(1));
