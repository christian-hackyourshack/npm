/// <reference types="vitest" />
import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import type { BuildOptions, LibraryOptions, UserConfig } from 'vite';
import { nodeBuiltins } from './nodeBuiltins';

interface LibConfig extends UserConfig {
  build: BuildOptions & {
    lib: LibraryOptions;
    rollupOptions: {
      external: string[];
    };
  };
}

export interface Options {
  /**
   * Path of library entry, default 'src/index.ts'
   */
  entry: string;
  /**
   * List of modules to exclude from pre-bundling
   */
  internals: string[];
  /**
   * List of modules to exclude from pre-bundling
   */
  fileName: string;
}

/**
 * Generate a base build configuration for libraries including vitest setup.
 *
 * The build configuration has the following characteristics:
 *
 * - build only esm format
 * - exclude all dependencies and node built-ins from bundling
 *
 * @param dirname Path of library
 * @param options all optional
 * @returns
 */
export async function buildLib(
  dirname: string,
  options: Partial<Options> = {}
): Promise<LibConfig> {
  const { entry = 'src/index.ts', internals = [], fileName = 'index' } = options;
  const packageJson = JSON.parse(await readFile(join(dirname, 'package.json'), 'utf8'));
  const externals = [
    ...Object.keys(packageJson.dependencies),
    ...Object.keys(packageJson.devDependencies),
  ].filter((d) => !internals.includes(d));
  return {
    build: {
      lib: {
        entry: resolve(dirname, entry),
        formats: ['es'],
        fileName,
      },
      rollupOptions: {
        external: [...nodeBuiltins, ...externals],
      },
    },
    test: {},
  };
}
