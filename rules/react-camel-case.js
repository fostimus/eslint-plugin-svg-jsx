/**
 * @fileoverview Rule to flag use of non camelCased props in React .js files
 * @author Derek Foster
 */

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
      return node.type === 'JSXSpreadAttribute'
    }

    // from react/jsx-no-multi-spaces
    function getPropName (propNode) {
      switch (propNode.type) {
        case "JSXSpreadAttribute":
          return context.getSourceCode().getText(propNode.argument)
        case "JSXIdentifier":
          return propNode.name
        case "JSXMemberExpression":
          return `${getPropName(propNode.object)}.${propNode.property.name}`
        default:
          return propNode.name
            ? propNode.name.name
            : `${context.getSourceCode().getText(propNode.object)}.${
                propNode.property.name
              }` // needed for typescript-eslint parser
      }
    }

    function getPropsFromSpreadObjectString (spreadObjectString) {
      const props = []
      let currentProp = ''
      let keyWithValue = false;
      [...spreadObjectString].forEach((c) => {
        if (c === ',') {
          currentProp = ''
          keyWithValue = false
          return
        } else if (c === '{' || c === '}' || c === ' ' || c === '\n' || keyWithValue) {
          return
        } else if (c === ':') {
          keyWithValue = true
          return
        }

        currentProp += c
      })

      // TODO: these props are returning empty rn, maybe forEach is async?

     return props
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

    
    
    return {
      JSXOpeningElement: (node) => {
        function attributeHandler (attr) {
          const propName = getPropName(attr)

          if (isSpreadAttribute(attr)) {
            const props = getPropsFromSpreadObjectString(propName);
            console.log(props)
            props.forEach(attributeHandler)
          }

          const dash = "-"
          if (
            propName.includes(dash) &&
            !isCustomHTMLElement(node) &&
            !ALLOWED_PREFIXES.some((prefix) => propName.startsWith(prefix))
          ) {
            if (propName.charAt(propName.length - 1) === dash) {
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
                  return fixer?.repalceText
                    ? fixer.replaceText(
                        attr.name,
                        getCamelCasedString(propName, dash)
                      )
                    : null
                },
              })
            }
          }
        }

        node.attributes.forEach(attributeHandler)
      },
    }
  },
}
