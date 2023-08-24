/**
 * @fileoverview Rule to flag use of non camelCased props in React .js files
 */

const {
  getPropName,
  isCustomHTMLElement,
  getJSXTagName,
  getPropIdentifier,
  isSpreadAttribute,
} = require('../helpers/jsx')
const {
  getPropsFromObjectString,
  getCamelCasedString,
  convertStringStyleValue,
} = require('../helpers')

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
  create(context) {
    const ALLOWED_PREFIXES = ['aria', 'data']

    return {
      JSXOpeningElement: (node) => {
        function validateAndFixProp(propName, fixableNode, charDelimiter) {
          if (
            propName?.includes &&
            propName.includes(charDelimiter) &&
            !isCustomHTMLElement(node) &&
            !ALLOWED_PREFIXES.some((prefix) => propName?.startsWith(prefix))
          ) {
            if (propName?.charAt(propName?.length - 1) === charDelimiter) {
              context.report({
                node,
                messageId: 'invalidProp',
              })
            } else {
              context.report({
                node,
                messageId: 'fixableProp',
                data: {
                  propName,
                  tagName: getJSXTagName(node),
                  fixableCharacter: charDelimiter,
                },
                fix(fixer) {
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

        function validateAndFixPropContent(propName, fixableNode) {
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
        }

        function handleSpreadOperator(attr, charDelimtiter) {
          const props = getPropsFromObjectString(getPropIdentifier(attr, context))
          props.forEach((prop) => {
            const nodeToFix = attr?.argument?.properties?.find((node) => {
              return node?.key?.value === prop
            })?.key

            validateAndFixProp(prop, nodeToFix, charDelimtiter)
          })
        }

        function handleCommonProps(attr, charDelimiter) {
          const propName = getPropName(attr, context)
          validateAndFixProp(propName, attr.name, charDelimiter)
          validateAndFixPropContent(propName, attr.value)
        }

        function attributeHandler(attr) {
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
