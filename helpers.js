// TODO: there should be validation that the spreadObjectString is actually an object.
// check beginning and end chars to validate?
function getPropsFromObjectString (spreadObjectString) {
  function normalizeProp (propName) {
    return propName.replaceAll("'", "")
  }

  const props = []
  let currentProp = ""
  let keyWithValue = false;
  [...spreadObjectString].forEach((c) => {
    if (c === ",") {
      props.push(normalizeProp(currentProp))
      currentProp = ""
      keyWithValue = false
      return
    } else if (
      c === "{" ||
      c === "}" ||
      c === " " ||
      c === "\n" ||
      keyWithValue
    ) {
      return
    } else if (c === ":") {
      keyWithValue = true
      return
    }

    currentProp += c
  })

  return props
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

module.exports = {
  getPropsFromObjectString,
  getCamelCasedString,
}