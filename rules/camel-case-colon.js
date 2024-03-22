/**
 * @fileoverview Rule to flag use of non camelCased props in React .js files
 */

const {
  getPropName,
  getPropIdentifier,
  isSpreadAttribute,
} = require('../helpers/jsx')
const { getPropsFromObjectString, getValidatePropFn } = require('../helpers')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      fixableProp:
        'JSX: found {{ fixableCharacter }} on prop {{ propName }} on {{ tagName }}. Fixable.',
      invalidProp:
        'JSX prop is invalid; the last character of the prop is not allowed. Not fixable.',
      stringStyleValue:
        'JSX prop is invalid; the value of the style prop is a string. Fixable.',
    },
    fixable: 'code',
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

        function handleSpreadOperator (attr, charDelimtiter) {
          const props = getPropsFromObjectString(
            getPropIdentifier(attr, context)
          )
          props.forEach((prop) => {
            const nodeToFix = attr?.argument?.properties?.find((node) => {
              return node?.key?.value === prop
            })?.key

            if (nodeToFix) {
              validateAndFixProp(prop, nodeToFix, charDelimtiter)
            }
          })
        }

        function handleCommonProps (attr, charDelimiter) {
          const propName = getPropName(attr, context)
          validateAndFixProp(propName, attr.name, charDelimiter)
        }

        function attributeHandler (attr) {
          const invalidCharacters = [':']

          // add other cases here
          if (isSpreadAttribute(attr)) {
            invalidCharacters.forEach((char) =>
              handleSpreadOperator(attr, char)
            )
          } else {
            invalidCharacters.forEach((char) => handleCommonProps(attr, char))
          }
        }

        node.attributes.forEach(attributeHandler)
      },
    }
  },
}
