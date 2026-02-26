const { RuleTester } = require('eslint')
const rule = require('../../rules/no-style-string')

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: ['@babel/plugin-syntax-jsx'],
    },
  },
})

ruleTester.run('no-style-string', rule, {
  valid: [
    { code: '<div style={{ color: "red" }} />' },
    { code: '<div className="foo" />' },
    { code: '<div title="hello" />' },
  ],
  invalid: [
    {
      code: '<div style="color:red" />',
      output: "<div style={{ color: 'red' }} />",
      errors: [{ messageId: 'stringStyleValue' }],
    },
    {
      code: '<div style="margin-top:10px;color:red" />',
      output: "<div style={{ marginTop: '10px', color: 'red' }} />",
      errors: [{ messageId: 'stringStyleValue' }],
    },
  ],
})
