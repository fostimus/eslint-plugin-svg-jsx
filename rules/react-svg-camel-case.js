/**
 * @fileoverview Rule to flag use of non camelCased props in SVGs used in React .js files
 * @author Derek Foster
 */

'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const BLOCK_DEFAULTS = [
  'describe',
  'it',
  'context',
  'test',
  'tape',
  'fixture',
  'serial',
]
const FOCUS_DEFAULTS = ['only']

module.exports = {
  create(context) {
    console.log(context)
  },
}
