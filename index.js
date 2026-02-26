'use strict'

const pkg = require('./package.json')

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    'camel-case-dash': require('./rules/camel-case-dash'),
    'camel-case-colon': require('./rules/camel-case-colon'),
    'no-style-string': require('./rules/no-style-string'),
  },
}

plugin.configs = {
  // flat config (eslint 9+)
  recommended: {
    plugins: { 'svg-jsx': plugin },
    rules: {
      'svg-jsx/camel-case-dash': 'error',
      'svg-jsx/camel-case-colon': 'error',
      'svg-jsx/no-style-string': 'error',
    },
  },
  // legacy config (eslint 8)
  'recommended-legacy': {
    plugins: ['svg-jsx'],
    rules: {
      'svg-jsx/camel-case-dash': 'error',
      'svg-jsx/camel-case-colon': 'error',
      'svg-jsx/no-style-string': 'error',
    },
  },
}

module.exports = plugin
