/**
 * @fileoverview Rule to flag use of non camelCased props in SVGs used in React .js files
 * @author Derek Foster
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const BLOCK_DEFAULTS = [
  "describe",
  "it",
  "context",
  "test",
  "tape",
  "fixture",
  "serial",
];
const FOCUS_DEFAULTS = ["only"];

module.exports = {
  meta: {
    type: "problem",
    messages: {
      dashedProps: "JSX: found dashes on prop {{ propName }} on {{ tagName }}.",
    },
  },
  create(context) {
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
        case "JSXOpeningElement":
          return jsxNode.name.name;
        default:
          return "";
      }
    }

    return {
      JSXOpeningElement: (node) => {
        node.attributes.forEach((attr) => {
          const propName = getPropName(attr);

          if (propName.includes("-")) {
            context.report({
              node,
              messageId: "dashedProps",
              data: {
                propName,
                tagName: getJSXTagName(node),
              },
              fix(fixer) {
                return null;
              },
            });
          }
        });
      },
    };
  },
};
