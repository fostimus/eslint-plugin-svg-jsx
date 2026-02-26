const assert = require('assert')
const {
  getCamelCasedString,
  getPropsFromObjectString,
  convertStringStyleValue,
} = require('../../helpers')

describe('getCamelCasedString', function () {
  it('converts a dashed string to camelCase', function () {
    assert.strictEqual(getCamelCasedString('stroke-width', '-'), 'strokeWidth')
  })

  it('converts a colon string to camelCase', function () {
    assert.strictEqual(getCamelCasedString('xmlns:xlink', ':'), 'xmlnsXlink')
  })

  it('handles multiple delimiters in one string', function () {
    assert.strictEqual(
      getCamelCasedString('stroke-line-cap', '-'),
      'strokeLineCap'
    )
  })

  it('returns the string unchanged if no delimiter present', function () {
    assert.strictEqual(getCamelCasedString('fill', '-'), 'fill')
  })
})

describe('getPropsFromObjectString', function () {
  it('parses a single prop from an object string', function () {
    const result = getPropsFromObjectString("{ 'clip-path': 'url(#clip)', }")
    assert.deepStrictEqual(result, ['clip-path'])
  })

  it('parses multiple props from an object string', function () {
    const result = getPropsFromObjectString(
      "{ 'clip-path': 'url(#clip)', 'stroke-width': '2', }"
    )
    assert.deepStrictEqual(result, ['clip-path', 'stroke-width'])
  })
})

describe('convertStringStyleValue', function () {
  it('converts a single CSS property', function () {
    assert.strictEqual(
      convertStringStyleValue('color:red'),
      "{ color: 'red' }"
    )
  })

  it('converts multiple CSS properties', function () {
    assert.strictEqual(
      convertStringStyleValue('margin-top:10px;color:red'),
      "{ marginTop: '10px', color: 'red' }"
    )
  })

  it('returns falsy values as-is', function () {
    assert.strictEqual(convertStringStyleValue(''), '')
    assert.strictEqual(convertStringStyleValue(null), null)
    assert.strictEqual(convertStringStyleValue(undefined), undefined)
  })
})
