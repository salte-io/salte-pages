const rollup = require('./rollup.config.js');
rollup.output.sourcemap = 'inline';
delete rollup.external;

module.exports = (config) => {
  config.set({
    basePath: '',

    frameworks: [
      'mocha',
      'sinon'
    ],

    files: [
      'tests/index.js'
    ],

    preprocessors: {
      'tests/index.js': ['rollup', 'sourcemap']
    },

    rollupPreprocessor: rollup,

    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'text' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
      ]
    },

    mochaReporter: {
      showDiff: true
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['ChromeHeadless'],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    browserNoActivityTimeout: 120000,

    singleRun: false
  });
}
