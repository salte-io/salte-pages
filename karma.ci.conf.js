const common = require('./rollup.common.config.js');

module.exports = (config) => {
  const lastTwoVersions = ['Chrome', 'Firefox', 'MicrosoftEdge', 'Safari'].reduce((output, browser) => {
    // TODO: For some reason Safari 12 throws a 500 error...
    output[`${browser}Latest`] = {
      base: 'SauceLabs',
      browserName: browser.toLowerCase(),
      version: browser === 'Safari' ? 'latest-1' : 'latest'
    };

    output[`${browser}Prior`] = {
      base: 'SauceLabs',
      browserName: browser.toLowerCase(),
      version: browser === 'Safari' ? 'latest-2' : 'latest-1'
    };
    return output;
  }, {});

  const customLaunchers = Object.assign(lastTwoVersions, {
    InternetExplorer11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11'
    }
  });

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

    rollupPreprocessor: common({
      minified: false,
      es6: false,

      external: [],
      output: {
        sourcemap: 'inline'
      }
    }),

    reporters: ['mocha', 'coverage'],

    mochaReporter: {
      output: 'minimal',
      showDiff: true
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    sauceLabs: {
      testName: 'salte-io/salte-pages',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: false
    },

    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    captureTimeout: 0,
    browserNoActivityTimeout: 120000,

    singleRun: true
  });
}
