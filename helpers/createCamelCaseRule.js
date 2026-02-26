const {
  isCustomHTMLElement,
  getJSXTagName,
  getPropName,
  getPropIdentifier,
  isSpreadAttribute,
} = require('./jsx')
const {
  getCamelCasedString,
  getPropsFromObjectString,
  MESSAGE_FIXABLE_PROP,
  MESSAGE_INVALID_PROP,
} = require('./index')

function getValidatePropFn ({ allowedPrefixes, currentNode, eslintContext }) {
  return function validateAndFixProp (propName, fixableNode, charDelimiter) {
    if (
      propName?.includes &&
      propName?.includes(charDelimiter) &&
      !isCustomHTMLElement(currentNode) &&
      !allowedPrefixes.some((prefix) => propName?.startsWith(prefix))
    ) {
      if (propName?.charAt(propName?.length - 1) === charDelimiter) {
        eslintContext.report({
          node: currentNode,
          messageId: 'invalidProp',
        })
      } else {
        if (fixableNode) {
          eslintContext.report({
            node: currentNode,
            messageId: 'fixableProp',
            data: {
              propName,
              tagName: getJSXTagName(currentNode),
              fixableCharacter: charDelimiter,
            },
            fix (fixer) {
              return fixer?.replaceText
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
}

function createCamelCaseRule (charDelimiter) {
  return {
    meta: {
      type: 'problem',
      messages: {
        fixableProp: MESSAGE_FIXABLE_PROP,
        invalidProp: MESSAGE_INVALID_PROP,
      },
      fixable: 'code',
      schema: [],
    },
    create (context) {
      const ALLOWED_PREFIXES = ['aria', 'data']

      return {
        JSXOpeningElement: (node) => {
          const validateAndFixProp = getValidatePropFn({
            allowedPrefixes: ALLOWED_PREFIXES,
            eslintContext: context,
            currentNode: node,
          })

          node.attributes.forEach((attr) => {
            if (isSpreadAttribute(attr)) {
              const props = getPropsFromObjectString(
                getPropIdentifier(attr, context)
              )
              props.forEach((prop) => {
                const nodeToFix = attr?.argument?.properties?.find((node) => {
                  return node?.key?.value === prop
                })?.key

                validateAndFixProp(prop, nodeToFix, charDelimiter)
              })
            } else {
              const propName = getPropName(attr, context)
              validateAndFixProp(propName, attr.name, charDelimiter)
            }
          })
        },
      }
    },
  }
}

module.exports = createCamelCaseRule
