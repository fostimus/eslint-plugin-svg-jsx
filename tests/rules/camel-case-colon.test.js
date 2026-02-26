const { RuleTester } = require('eslint')
const rule = require('../../rules/camel-case-colon')

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: ['@babel/plugin-syntax-jsx'],
    },
  },
})

ruleTester.run('camel-case-colon', rule, {
  valid: [
    { code: '<svg fill="red" />' },
    { code: '<svg aria-label="icon" />' },
    { code: '<svg data-testid="svg" />' },
    { code: '<svg xmlnsXlink="http://www.w3.org/1999/xlink" />' },
  ],
  invalid: [
    {
      code: '<svg xmlns:xlink="http://www.w3.org/1999/xlink" />',
      output: '<svg xmlnsXlink="http://www.w3.org/1999/xlink" />',
      errors: [{ messageId: 'fixableProp' }],
    },
  ],
})
