const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const glob = require('rollup-plugin-glob-import');
const babel = require('rollup-plugin-babel');
const serve = require('rollup-plugin-serve');
const copy = require('rollup-plugin-copy-assets-to');

module.exports = {
  input: 'demo/salte-app.js',
  external: [],
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
    exports: 'named'
  },
  plugins: [
    resolve(),
    commonjs(),
    glob(),
    babel({
      exclude: /node_modules\/(?!(@webcomponents|lit-html|lit-element|chai-as-promised)\/).*/,

      runtimeHelpers: true,

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

      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-transform-runtime', {
          regenerator: true
        }]
      ]
    }),

    serve({
      host: '0.0.0.0',
      port: 8080,

      contentBase: 'dist',

      historyApiFallback: true
    }),

    copy({
      assets: [
        'demo/index.html',
        'node_modules/web-animations-js/web-animations-next-lite.min.js',
        'node_modules/web-animations-js/web-animations-next-lite.min.js.map'
      ],
      outputDir: 'dist'
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
}
