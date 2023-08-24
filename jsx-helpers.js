function isSpreadAttribute(node) {
  return node.type === 'JSXSpreadAttribute'
}

// from source code for react/jsx-no-multi-spaces, getPropName
function getPropIdentifier(node, context) {
  const defaultCase = (node) => {
    return node.name
      ? node.name.name
      : `${context.getSourceCode().getText(node.object)}.${node.property.name}` // needed for typescript-eslint parser
  }

  switch (node.type) {
    case 'JSXSpreadAttribute':
      return context.getSourceCode().getText(node.argument)
    case 'JSXIdentifier':
      return node.name
    case 'JSXMemberExpression':
      return `${getPropIdentifier(node.object, context)}.${node.property.name}`
    case 'JSXAttribute':
      if (node?.name?.namespace?.name && node?.name?.name?.name) {
        return `${node?.name?.namespace?.name}:${node?.name?.name?.name}`
      } else if (node?.name?.name === 'style') {
        return defaultCase(node)
      } else {
        return defaultCase(node)
      }
    default:
      return defaultCase(node)
  }
}

function getPropName(attr, context) {
  if (typeof attr === 'string') {
    return attr
  } else {
    return getPropIdentifier(attr, context)
  }
}

function getJSXTagName(jsxNode) {
  switch (jsxNode.type) {
    case 'JSXIdentifier':
      return jsxNode.name
    default:
      return jsxNode.name.name
  }
}

function isCustomHTMLElement(node) {
  return getJSXTagName(node)?.includes('-')
}


module.exports = {
  isCustomHTMLElement,
  getJSXTagName,
  getPropName,
  getPropIdentifier,
  isSpreadAttribute,
}