const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const glob = require('rollup-plugin-glob-import');
const babel = require('rollup-plugin-babel');
const deindent = require('deindent');
const { terser } = require('rollup-plugin-terser');
const istanbul = require('rollup-plugin-istanbul');
const builtins = require('rollup-plugin-node-builtins');

const { name, contributors, version } = require('./package.json');

module.exports = function(config) {
  const { minified, es6, coverage, tests } = config;

  return {
    input: 'src/salte-pages.js',
    external: tests ? [] : ['lit-element'],
    output: {
      file: `dist/salte-pages${minified ? '.min' : ''}.${es6 ? 'mjs' : 'js'}`,
      format: es6 ? 'es' : 'umd',
      name: 'salte-pages',
      sourcemap: tests ? 'inline' : true,
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
      coverage && istanbul({
        include: ['src/**/*.js']
      }),

      tests && builtins(),

      resolve({
        preferBuiltins: true
      }),

      commonjs(),
      glob(),

      babel({
        exclude: /node_modules\/(?!(@webcomponents|lit-html|lit-element|chai-as-promised)\/).*/,

        runtimeHelpers: !!tests,

        presets: [['@babel/preset-env', {
          targets: es6 ? {
            esmodules: true
          } : {
            browsers: [
              'last 2 chrome versions',
              'last 2 firefox versions',
              'last 2 edge versions',
              'IE >= 10',
              'Safari >= 7'
            ]
          }
        }]],

        plugins: tests ? [
          ['@babel/plugin-transform-runtime', {
            regenerator: true
          }]
        ] : []
      }),

      minified && terser({
        output: {
          comments: function (node, comment) {
            const { value, type } = comment;
            if (type == 'comment2') {
              // multiline comment
              return /@license/i.test(value);
            }
          }
        }
      })
    ],

    watch: {
      include: ['src/**', 'demo/**']
    },

    onwarn: function(warning) {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
          console.error(`(!) ${warning.message}`);
      }
    }
  };
}
