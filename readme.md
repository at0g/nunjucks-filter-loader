# nunjucks-filter-loader

A configuration helper to load and register nunjucks filters from one or more directories.
  
## installation

`npm install nunjucks-filter-loader --save`

## usage

### single directory
```
var nunjucks = require('nunjucks');
var nunjucksEnv = nunjucks.configure('/path/to/templates');
var filters = require('nunjucks-filter-loader');

filters.configure({
    env: nunjucksEnv,
    // Will load js/filters/*.js
    paths: 'js/filters'
});

```

### multiple directories
```
var nunjucks = require('nunjucks');
var nunjucksEnv = nunjucks.configure('/path/to/templates');
var filters = require('nunjucks-filter-loader');

filters.configure({
    env: nunjucksEnv,
    // Will load js/filters/*.js and js/custom/*.js
    paths: ['js/filters', 'js/custom']
});

```

# notes

- `index.js` files are ignored, as are files without a .js extension
- The directory lookup is not recursive
- The name of the filter is derived from the filename by removing the __.js__ extension. 


If a file exports an object instead of a function, the objects keys will be used instead.

`myobj.js`

```
exports.foo = function(){...}
exports.bar = function(){...}
exports.baz = 'baz' 
```

If `myobj.js` is included, then `foo` and `bar` will be included (they are functions), 
but `baz` will not (as it's a string)





## running tests

`npm test` (or `mocha`)