import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {eslint} from 'rollup-plugin-eslint';
import {terser} from 'rollup-plugin-terser';

const rollupOptions = {
  plugins: [
    resolve({
      extensions: ['.js', '.jsx']
    }),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js', '.jsx']
    }),
    eslint({
      throwOnError: true
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    terser()
  ],
  external: [
    'react',
    '@storybook/addons',
    '@storybook/components',
    '@storybook/core-events',
    '@storybook/theming'
  ],
  context: 'this'
};

export default [{
  ...rollupOptions,
  input: 'src/index.js',
  output: {
    file: 'index.js',
    format: 'cjs',
    sourcemap: true
  }
}, {
  ...rollupOptions,
  input: 'src/register.js',
  output: {
    file: 'register.js',
    format: 'cjs',
    sourcemap: true
  }
}]
