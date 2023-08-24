/**
 * @fileoverview Rule to flag use of non camelCased props in React .js files
 */

const { getPropName } = require('../helpers/jsx')
const { convertStringStyleValue } = require('../helpers')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      stringStyleValue:
        'JSX prop is invalid; the value of the style prop is a string. Fixable.',
    },
    fixable: 'code',
  },
  create(context) {
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
              fix(fixer) {
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
