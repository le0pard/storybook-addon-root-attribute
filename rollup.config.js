import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const rollupOptions = {
  plugins: [
    resolve({
      extensions: ['.js', '.jsx']
    }),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js', '.jsx']
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  external: [
    'react',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'storybook/manager-api',
    'storybook/preview-api',
    'storybook/internal/components',
    'storybook/internal/core-events',
    'storybook/internal/theming',
    '@storybook/icons'
  ],
  context: 'this'
};

export default [{
  ...rollupOptions,
  input: 'src/index.js',
  output: {
    file: 'index.js',
    format: 'es',
    exports: 'auto',
    sourcemap: true
  }
}, {
  ...rollupOptions,
  input: 'src/register.js',
  output: {
    file: 'register.js',
    format: 'es',
    exports: 'auto',
    sourcemap: true
  }
}]
