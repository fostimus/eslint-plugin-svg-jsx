# eslint-plugin-svg-jsx

Enforce camelCased props instead of dashed props. 

NPM package: https://www.npmjs.com/package/eslint-plugin-svg-jsx

## Add to your project

1. Add the dependency: `yarn add -D eslint-plugin-svg-jsx` or `npm install --save-dev eslint-plugin-svg-jsx`
2. In your .eslintrc.js:
    1. Add `svg-jsx` to your plugins
    2. Add the `svg-jsx` rules:
    ```
    'svg-jsx/camel-case-dash': 'error',
    'svg-jsx/camel-case-colon': 'error',
    'svg-jsx/no-style-string': 'error',
    ```

Final .eslintrc.js should look something like:

```js
module.exports = {
  parser: "@babel/eslint-parser",
  extends: ["standard", "standard-jsx", "plugin:prettier/recommended"],
  plugins: ["no-only-tests", "prettier", "svg-jsx"],
  rules: {
    "svg-jsx/camel-case-dash": "error",
    "svg-jsx/camel-case-colon": "error",
    "svg-jsx/no-style-string": "error",
  },
}
```

## Code examples

Case #1: Dashes in props. 

```js
// invalid
<MyComponent margin-left={30} />

// valid
<MyComponent marginLeft={30} />

```

Case #2: Colons in props. 

```js
// invalid
<svg
    width="546"
    height="382"
    viewBox="0 0 546 382"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
/>

// valid
<svg
    width="546"
    height="382"
    viewBox="0 0 546 382"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
/>
```

Case #3: string style attributes
```js
// invalid
<mask
    style="mask-type:alpha"
    maskUnits="userSpaceOnUse"
    x="408"
    y="144"
    width="90"
    height="194"
/>

// valid
<mask
    style={{ maskType: 'alpha' }}
    maskUnits="userSpaceOnUse"
    x="408"
    y="144"
    width="90"
    height="194"
/>


```


## Contributing

Pull requests are welcome. Please checkout the [open issues](https://github.com/fostimus/eslint-plugin-svg-jsx/issues) we have if you'd like to help out. Bugfixes and related features are also welcome.