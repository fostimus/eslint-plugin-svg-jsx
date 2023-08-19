# eslint-plugin-react-camel-case

Enforce camelCased props instead of dashed props.

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

Case #3: string style attributes: NOT YET IMPLEMENTED
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

Pull requests are welcome. Please checkout the [open issues](https://github.com/fostimus/eslint-plugin-react-camel-case/issues) we have if you'd like to help out. Bugfixes and related features are also welcome.