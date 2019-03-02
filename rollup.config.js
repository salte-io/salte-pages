const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const glob = require('rollup-plugin-glob-import');
const babel = require('rollup-plugin-babel');
const deindent = require('deindent');
const { terser } = require('rollup-plugin-terser');
const serve = require('rollup-plugin-serve');
const copy = require('rollup-plugin-copy-assets-to');

const { name, contributors, version } = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';
const SERVE = process.env.SERVE === 'true';

module.exports = {
  input: SERVE ? 'demo/salte-app.js' : 'src/salte-pages.js',
  external: SERVE ? [] : ['lit-element'],
  output: {
    dir: 'dist',
    // file: `[name]${isProduction ? '.min' : ''}.js`,
    format: SERVE ? 'es' : 'umd',
    name: 'salte-pages',
    sourcemap: true,
    exports: 'named',
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
    glob(),
    babel({
      exclude: /node_modules\/(?!(@webcomponents|lit-html|lit-element|chai-as-promised)\/).*/,

      presets: [['@babel/preset-env', {
        modules: false,
        targets: {
          browsers: [
            'last 2 chrome versions',
            'last 2 firefox versions',
            'last 2 edge versions',
            'IE >= 10',
            'Safari >= 7'
          ]
        }
      }]],

      plugins: ['@babel/plugin-syntax-dynamic-import']
    }),

    isProduction && terser({
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

    SERVE && serve({
      host: '0.0.0.0',
      port: 8080,

      contentBase: 'dist',

      historyApiFallback: true
    }),

    SERVE && copy({
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
  },

  onwarn: function(warning) {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        console.error(`(!) ${warning.message}`);
    }
  }
};
