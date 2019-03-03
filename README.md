# Salte Pages

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Travis][travis-ci-image]][travis-ci-url]
[![Coveralls][coveralls-image]][coveralls-url]

[![semantic-release][semantic-release-image]][semantic-release-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

Simple Page Management

## Supported Browsers

`salte-pages` guarantees support for the following browsers:

* Chrome (last 2 versions)
* Safari (last 2 versions)
* Opera (last 2 versions)
* Edge (last 2 versions)
* IE 11

Edge and Internet Explorer 11 require the web components polyfills.

## Install

```sh
$ npm install @salte-io/salte-pages
```

Then add a `<script>` to your index.html:

```html
<script src="/node_modules/@salte-io/salte-pages/dist/salte-pages.js"></script>
```

Or `require('@salte-io/salte-pages')` from your code.

### Usage

Here's a simplified example of how it can be used!

```html
<salte-pages selected="dashboard" fallback="404">
    <my-dashboard page="dashboard"></my-dashboard>
    <div page="404">Native Elements are also supported!</div>
</salte-pages>
```

Also a [Live Demo](https://salte-pages-demo.glitch.me/)!

[npm-version-image]: https://img.shields.io/npm/v/@salte-io/salte-pages.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@salte-io/salte-pages.svg?style=flat
[npm-url]: https://npmjs.org/package/@salte-io/salte-pages

[travis-ci-image]: https://img.shields.io/travis/com/salte-io/salte-pages/master.svg?style=flat
[travis-ci-url]: https://travis-ci.com/salte-io/salte-pages

[coveralls-image]: https://img.shields.io/coveralls/salte-io/salte-pages/master.svg
[coveralls-url]: https://coveralls.io/github/salte-io/salte-pages?branch=master

[semantic-release-url]: https://github.com/semantic-release/semantic-release
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[greenkeeper-image]: https://badges.greenkeeper.io/salte-io/salte-pages.svg
[greenkeeper-url]: https://greenkeeper.io
