/**
 * @fileoverview Rule to flag use of non camelCased props in React .js files
 */

const { getPropName } = require('../helpers/jsx')
const {
  convertStringStyleValue,
  MESSAGE_STYLE_STRING_VALUE,
} = require('../helpers')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      stringStyleValue: MESSAGE_STYLE_STRING_VALUE,
    },
    fixable: 'code',
  },
  create (context) {
    return {
      JSXOpeningElement: (node) => {
        node.attributes.forEach((attr) => {
          const propName = getPropName(attr, context)
          const fixableNode = attr.value
          if (propName === 'style' && typeof fixableNode.value === 'string') {
            context.report({
              node,
              messageId: 'stringStyleValue',
              data: {
                propName,
              },
              fix (fixer) {
                return fixer?.replaceText
                  ? fixer.replaceText(
                      fixableNode,
                      `{${convertStringStyleValue(fixableNode.value)}}`
                    )
                  : null
              },
            })
          }
        })
      },
    }
  },
}
