"use strict"

module.exports = {
  extends: ["plugin:prettier/recommended"],
  plugins: ["prettier"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    "arrow-parens": ["error", "always"], // https://eslint.org/docs/rules/arrow-parens
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "ignore",
      },
    ],
    semi: ["error", "never"],
    "space-before-function-paren": ["error", "always"],

    "prettier/prettier": "off",
    "array-callback-return": "warn",
    "no-prototype-builtins": "warn",
    "prefer-regex-literals": "warn",
  },
}
