const { RuleTester } = require('eslint')
const rule = require('../../rules/camel-case-dash')

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: ['@babel/plugin-syntax-jsx'],
    },
  },
})

ruleTester.run('camel-case-dash', rule, {
  valid: [
    { code: '<svg fill="red" />' },
    { code: '<svg aria-label="icon" />' },
    { code: '<svg data-testid="svg" />' },
    { code: '<my-comp stroke-width="1" />' },
    { code: '<svg clipPath="url(#clip)" />' },
  ],
  invalid: [
    {
      code: '<svg clip-path="url(#clip)" />',
      output: '<svg clipPath="url(#clip)" />',
      errors: [{ messageId: 'fixableProp' }],
    },
    {
      code: '<svg stroke-width="2" />',
      output: '<svg strokeWidth="2" />',
      errors: [{ messageId: 'fixableProp' }],
    },
    {
      code: '<svg stroke-linecap="round" />',
      output: '<svg strokeLinecap="round" />',
      errors: [{ messageId: 'fixableProp' }],
    },
    {
      code: '<svg bad-="val" />',
      errors: [{ messageId: 'invalidProp' }],
    },
  ],
})
