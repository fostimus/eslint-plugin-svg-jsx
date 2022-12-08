/**
 * @fileoverview Rule to flag use of non camelCased props in React .js files
 * @author Derek Foster
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "problem",
    messages: {
      dashedProp: "JSX: found dashes on prop {{ propName }} on {{ tagName }}.",
      invalidProp:
        "JSX prop is invalid; - character is the last character of the prop.",
    },
    fixable: "code",
  },
  create(context) {
    const ALLOWED_PREFIXES = ["aria", "data"];

    // from react/jsx-no-multi-spaces
    function getPropName(propNode) {
      switch (propNode.type) {
        case "JSXSpreadAttribute":
          return context.getSourceCode().getText(propNode.argument);
        case "JSXIdentifier":
          return propNode.name;
        case "JSXMemberExpression":
          return `${getPropName(propNode.object)}.${propNode.property.name}`;
        default:
          return propNode.name
            ? propNode.name.name
            : `${context.getSourceCode().getText(propNode.object)}.${
                propNode.property.name
              }`; // needed for typescript-eslint parser
      }
    }

    function getJSXTagName(jsxNode) {
      switch (jsxNode.type) {
        case "JSXIdentifier":
          return propNode.name;
        default:
          return jsxNode.name.name;
      }
    }

    function isCustomHTMLElement(node) {
      return getJSXTagName(node).includes("-");
    }

    return {
      JSXOpeningElement: (node) => {
        node.attributes.forEach((attr) => {
          const propName = getPropName(attr);

          if (
            propName.includes("-") &&
            !isCustomHTMLElement(node) &&
            !ALLOWED_PREFIXES.some((prefix) => propName.startsWith(prefix))
          ) {
            if (propName.charAt(propName.length - 1) === "-") {
              context.report({
                node,
                messageId: "invalidProp",
              });
            } else {
              context.report({
                node,
                messageId: "dashedProp",
                data: {
                  propName,
                  tagName: getJSXTagName(node),
                },
                fix(fixer) {
                  let newPropName = propName;
                  while (newPropName.includes("-")) {
                    const indexOfDash = newPropName.indexOf("-");
                    const charAfterDash = newPropName.charAt(indexOfDash + 1);

                    newPropName = `${newPropName.substring(
                      0,
                      indexOfDash
                    )}${charAfterDash.toUpperCase()}${newPropName.substring(
                      indexOfDash + 2,
                      newPropName.length
                    )}`;
                  }

                  return fixer.replaceText(attr.name, newPropName);
                },
              });
            }
          }
        });
      },
    };
  },
};
