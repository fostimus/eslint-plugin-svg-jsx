/**
 * @fileoverview Rule to flag use of non camelCased props in React .js files
 */

const {
  getPropName,
  getPropIdentifier,
  isSpreadAttribute,
} = require('../helpers/jsx')
const {
  getPropsFromObjectString,
  getValidatePropFn,
  MESSAGE_FIXABLE_PROP,
  MESSAGE_INVALID_PROP,
} = require('../helpers')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      fixableProp: MESSAGE_FIXABLE_PROP,
      invalidProp: MESSAGE_INVALID_PROP,
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

        function handleSpreadOperator (attr, charDelimiter) {
          const props = getPropsFromObjectString(
            getPropIdentifier(attr, context)
          )
          props.forEach((prop) => {
            const nodeToFix = attr?.argument?.properties?.find((node) => {
              return node?.key?.value === prop
            })?.key

            validateAndFixProp(prop, nodeToFix, charDelimiter)
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
