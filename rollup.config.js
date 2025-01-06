import commonjs from '@rollup/plugin-commonjs';
import ts from '@rollup/plugin-typescript';
import { cleandir } from 'rollup-plugin-cleandir';

/** @type {import("rollup").MergedRollupOptions} */
export default {
  input: 'src/index.ts',
  plugins: [
    ts({
      tsconfig: 'tsconfig.build.json',
      module: 'nodenext',
    }),
    commonjs(),
    cleandir('./dist/'),
  ],
  output: [
    {
      dir: './dist/',
      format: 'es',
      preserveModules: true,
      sourcemap: true,
    },
    {
      dir: './dist/',
      format: 'cjs',
      preserveModules: true,
      sourcemap: true,
      entryFileNames: '[name].cjs',
    },
  ],
};
