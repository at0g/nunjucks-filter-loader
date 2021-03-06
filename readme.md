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

### options.mapping

An optional mapping object can be passed to configure to allow per-filter configuration.
Mapping allows you to perform a few tasks:

- Mark a filter as being async: `{ myfiltername: { async: true} }`
- Alias a filter to another name `{ markdown: { alias: 'md' }`
- Alias a filter to multiple names `{ marked: { alias: ['markdown', 'md'] }`
- Invoke a function with parameters to return the filter function `{ myfn: { apply: { scope: this, params: [1, 'two', ...] }`

The mapping object takes the following form:
```
var filters = require('nunjucks-filter-loader');
filters.configure({
    env: nunjucksEnv,
    paths: 'path/to/templates',
    mapping: {
        nameOfFilter: {
            async: true || false,
            alias: string || [string],
            apply: { scope: object, params: [] }
        }
    }
});
```


### sync vs async file operations

If a callback function is provided as the second parameter to configure, 
then file read operations will be made asynchronously.

```
var filters = require('nunjucks-filter-loader');
var result = filters.configure({...}); // sync method, returns the filter map to result 
```

```
var filters = require('nunjucks-filter-loader');
// Trigger async file loading by passing a second parameter after options
filters.configure({...}, function(err, result){
    // async method - filter map is passed as the second parameter to the callback
});
```


# notes

- `index.js` files are ignored, as are files without a .js extension
- The directory lookup is not recursive
- The name of the filter is derived from the filename by removing the __.js__ extension.
- An error is thrown if filenames collide (such as adding two paths that contain `foo.js`).
- Relative directory paths are resolved to `process.cwd()`. Absolute paths are used verbatim.

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

`npm test` (or `mocha`) - Run all tests

`mocha test/unit` - Run unit tests

`mocha test/functional` - Run functional tests

`npm run coverage` - Check code coverage with istanbul
