const { isCustomHTMLElement, getJSXTagName } = require('./jsx')

function getValidatePropFn ({ allowedPrefixes, currentNode, eslintContext }) {
  return function validateAndFixProp (propName, fixableNode, charDelimiter) {
    if (
      propName?.includes &&
      propName.includes(charDelimiter) &&
      !isCustomHTMLElement(currentNode) &&
      !allowedPrefixes.some((prefix) => propName?.startsWith(prefix))
    ) {
      if (propName?.charAt(propName?.length - 1) === charDelimiter) {
        eslintContext.report({
          node: currentNode,
          messageId: 'invalidProp',
        })
      } else {
        eslintContext.report({
          node: currentNode,
          messageId: 'fixableProp',
          data: {
            propName,
            tagName: getJSXTagName(currentNode),
            fixableCharacter: charDelimiter,
          },
          fix (fixer) {
            return fixer?.replaceText && !!fixableNode
              ? fixer.replaceText(
                  fixableNode,
                  getCamelCasedString(propName, charDelimiter)
                )
              : null
          },
        })
      }
    }
  }
}

// TODO: there should be validation that the spreadObjectString is actually an object.
// check beginning and end chars to validate?
function getPropsFromObjectString (spreadObjectString) {
  function normalizeProp (propName) {
    return propName.replaceAll("'", '')
  }

  const props = []
  let currentProp = ''
  let keyWithValue = false
  ;[...spreadObjectString].forEach((c) => {
    if (c === ',') {
      props.push(normalizeProp(currentProp))
      currentProp = ''
      keyWithValue = false
      return
    } else if (
      c === '{' ||
      c === '}' ||
      c === ' ' ||
      c === '\n' ||
      keyWithValue
    ) {
      return
    } else if (c === ':') {
      keyWithValue = true
      return
    }

    currentProp += c
  })

  return props
}

function getCamelCasedString (str, charDelimiter) {
  let newPropName = str
  while (newPropName.includes(charDelimiter)) {
    const indexOfDash = newPropName.indexOf(charDelimiter)
    const charAfterDash = newPropName.charAt(indexOfDash + 1)

    newPropName = `${newPropName.substring(
      0,
      indexOfDash
    )}${charAfterDash.toUpperCase()}${newPropName.substring(
      indexOfDash + 2,
      newPropName.length
    )}`
  }
  return newPropName
}

function stringify (obj) {
  let stringified = ''
  Object.entries(obj).forEach(([key, val]) => {
    stringified += ` ${key}: '${val}',`
  })

  // remove trailing comma, wrap in object literal. spacing is important.
  return `{${stringified.substring(0, stringified.length - 1)} }`
}

// example of 1 key-value pair: "mask-type:alpha" -> { maskType: 'alpha' }
// example of 2 key-value pairs: "mask-type:alpha;mask-repeat:no-repeat" -> { maskType: 'alpha', maskRepeat: 'no-repeat' }
// example of 3 key-value pairs: "mask-type:alpha;mask-repeat:no-repeat;mask-position:center" -> { maskType: 'alpha', maskRepeat: 'no-repeat', maskPosition: 'center' }
function convertStringStyleValue (value) {
  if (!value) return value

  const styleRules = value.split(';')
  const styleObject = styleRules.reduce((acc, rule) => {
    const [key, val] = rule.split(':')
    const camelCasedKey = getCamelCasedString(key.trim(), '-')
    return { ...acc, [camelCasedKey]: val.trim() }
  }, {})

  return stringify(styleObject)
}

module.exports = {
  getValidatePropFn,
  getPropsFromObjectString,
  getCamelCasedString,
  convertStringStyleValue,
}
