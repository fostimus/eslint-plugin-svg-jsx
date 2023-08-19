/**
 * @fileoverview Rule to flag use of non camelCased props in React .js files
 */

const { getPropsFromObjectString, getCamelCasedString } = require("../helpers")

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "problem",
    messages: {
      fixableProp:
        "JSX: found {{ fixableCharacter }} on prop {{ propName }} on {{ tagName }}. Fixable.",
      invalidProp:
        "JSX prop is invalid; the last character of the prop is not allowed. Not fixable.",
    },
    fixable: "code",
  },
  create (context) {
    const ALLOWED_PREFIXES = ["aria", "data"]

    function isSpreadAttribute (node) {
      return node.type === "JSXSpreadAttribute"
    }

    // from source code for react/jsx-no-multi-spaces, getPropName
    function getPropContent (node) {
      switch (node.type) {
        case "JSXSpreadAttribute":
          return context.getSourceCode().getText(node.argument)
        case "JSXIdentifier":
          return node.name
        case "JSXMemberExpression":
          return `${getPropContent(node.object)}.${node.property.name}`
        default:
          return node.name
            ? node.name.name
            : `${context.getSourceCode().getText(node.object)}.${
                node.property.name
              }` // needed for typescript-eslint parser
      }
    }

    function getPropName (attr) {
      if (typeof attr === "string") {
        return attr
      } else {
        return getPropContent(attr)
      }
    }

    function getJSXTagName (jsxNode) {
      switch (jsxNode.type) {
        case "JSXIdentifier":
          return jsxNode.name
        default:
          return jsxNode.name.name
      }
    }

    function isCustomHTMLElement (node) {
      return getJSXTagName(node)?.includes("-")
    }

    return {
      JSXOpeningElement: (node) => {
        function validateAndFixProp (propName, fixableNode, charDelimiter) {
          if (
            propName?.includes &&
            propName.includes(charDelimiter) &&
            !isCustomHTMLElement(node) &&
            !ALLOWED_PREFIXES.some((prefix) => propName?.startsWith(prefix))
          ) {
            if (propName?.charAt(propName?.length - 1) === charDelimiter) {
              context.report({
                node,
                messageId: "invalidProp",
              })
            } else {
              context.report({
                node,
                messageId: "fixableProp",
                data: {
                  propName,
                  tagName: getJSXTagName(node),
                  fixableCharacter: "dashes",
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

        function handleSpreadOperator (attr, charDelimtiter) {
          const props = getPropsFromObjectString(getPropContent(attr))
          props.forEach((prop) => {
            const nodeToFix = attr?.argument?.properties?.find((node) => {
              return node?.key?.value === prop
            })?.key

            validateAndFixProp(prop, nodeToFix, charDelimtiter)
          })
        }

        function handleCommonProps (attr, charDelimiter) {
          validateAndFixProp(getPropName(attr), attr.name, charDelimiter)
        }

        function attributeHandler (attr) {
          // opportunity to extend this to a list, for things like colons
          const dash = "-"

          // add other cases here
          if (isSpreadAttribute(attr)) {
            handleSpreadOperator(attr, dash)
          } else {
            handleCommonProps(attr, dash)
          }
        }

        node.attributes.forEach(attributeHandler)
      },
    }
  },
}
