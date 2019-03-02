import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import deindent from 'deindent';

import { name, contributors, version } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';
const SERVE = process.env.SERVE === 'true';

export default (async () => ({
  input: SERVE ? 'demo/salte-app.js' : 'src/salte-pages.js',
  external: SERVE ? [] : ['lit-element'],
  output: {
    dir: 'dist',
    // file: `[name]${isProduction ? '.min' : ''}.js`,
    format: SERVE ? 'es' : 'umd',
    name: 'salte-pages',
    sourcemap: true,
    banner: deindent`
      /**
       * ${name} JavaScript Library v${version}
       *
       * @license MIT (https://github.com/salte-io/salte-pagess/blob/master/LICENSE)
       *
       * Made with ♥ by ${contributors.join(', ')}
       */
    `,
    globals: {
      'lit-element': 'LitElement'
    }
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',

      plugins: ['@babel/plugin-syntax-dynamic-import']
    }),

    isProduction && (await import('rollup-plugin-terser')).terser({
      output: {
        comments: function (node, comment) {
          const { value, type } = comment;
          if (type == 'comment2') {
            // multiline comment
            return /@license/i.test(value);
          }
        }
      }
    }),

    SERVE && (await import('rollup-plugin-serve'))({
      host: '0.0.0.0',
      port: 8080,

      contentBase: 'dist',

      historyApiFallback: true
    }),

    SERVE && (await import('rollup-plugin-copy-assets-to'))({
      assets: [
        'demo/index.html',
        'node_modules/web-animations-js/web-animations-next-lite.min.js',
        'node_modules/web-animations-js/web-animations-next-lite.min.js.map'
      ],
      outputDir: 'dist'
    })
  ],

  watch: {
    clearScreen: true,
    exclude: 'node_modules/**'
  }
}))();
