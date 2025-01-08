import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index.ts'],
  clean: true,
  outDir: './dist/',
  declaration: 'compatible',
  sourcemap: true,
  rollup: {
    emitCJS: true,
  },
});
